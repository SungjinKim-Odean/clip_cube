<template>
    <v-container ref="viewContainer" class="fill-height ma-0 pa-0" fluid align-start>
        <v-row class="fill-height ma-0 pa-0">
            <v-col class="ma-0 pa-0" style="maxWidth: 40px">
                <v-navigation-drawer class="grey lighten-1" max-width="40" absolute mini-variant mini-variant-width="40" permanent>
                    <v-list dense nav>
                        <v-list-item><TooltipedMenuIcon :styleAttr="$styleConfig.mapToolBar.iconButton" icon="mdi-plus-circle-outline" tooltip="Zoom in" @click="zoomIn()"/></v-list-item>         
                        <v-list-item><TooltipedMenuIcon :styleAttr="$styleConfig.mapToolBar.iconButton" icon="mdi-minus-circle-outline" tooltip="Zoom out" @click="zoomOut()"/></v-list-item>         
                        <v-list-item><TooltipedMenuIcon :styleAttr="$styleConfig.mapToolBar.iconButton" icon="mdi-rotate-left" tooltip="Rotate left" @click="rotate(-90)"/></v-list-item>         
                        <v-list-item><TooltipedMenuIcon :styleAttr="$styleConfig.mapToolBar.iconButton" icon="mdi-rotate-right" tooltip="Rotate right" @click="rotate(90)"/></v-list-item>         
                        <v-list-item><TooltipedMenuIcon :styleAttr="$styleConfig.mapToolBar.iconButton" icon="mdi-rotate-orbit" tooltip="Rotation mode" :pushed="currentControlMode==='rotate'" @click="controlManager.setControlMode(controlMode.Rotation)"/></v-list-item>         
                        <v-list-item><TooltipedMenuIcon :styleAttr="$styleConfig.mapToolBar.iconButton" icon="mdi-pan" tooltip="Pan mode" :pushed="currentControlMode==='pan'" @click="controlManager.setControlMode(controlMode.Pan)"/></v-list-item>         
                        <v-list-item><TooltipedMenuIcon :styleAttr="$styleConfig.mapToolBar.iconButton" icon="mdi-overscan" tooltip="Fit scene" @click="fitMapToScene()"/></v-list-item>         
                        <v-list-item><TooltipedMenuIcon :styleAttr="$styleConfig.mapToolBar.iconButton" icon="mdi-grid" tooltip="Toggle gridline" :pushed="showGridline" @click="showGridline=!showGridline"/></v-list-item>                        
                        <v-list-item><TooltipedMenuIcon :styleAttr="$styleConfig.mapToolBar.iconButton" icon="mdi-vector-polyline" tooltip="Clip mode" :pushed="currentControlMode==='measure'" @click="controlManager.setControlMode(controlMode.Measure)"/></v-list-item>                                          
                    </v-list>
                </v-navigation-drawer>
            </v-col>
            <v-col class="ma-0 pa-0">               
                <div id="three-container" style="width:100%; height:100%; margin-left: 0px; margin-right: 0px; margin-top: 0px; margin-bottom: 0px; display: block;">        
                    <ThreeControlModeGuide :show="showControlGuide" :positionStyle="{position:'absolute',width:'calc(100% - 40px)',height:'60px',top:'5px',left:'40px','z-index':'2'}" :text="controlGuideText"/>                  
                </div>    
            </v-col>                
        </v-row>
    </v-container>    
</template>

<script>
import * as THREE from 'three'
import { Rect } from '../../model/Rect.js'
import { CameraManager } from '../threeview/CameraManager.js'
import { ControlManager } from '../threeview/ControlManager.js'
import { CoordAxes } from '../threeview/SceneNode/CoordAxes.js'
import { Gridline } from '../threeview/SceneNode/Gridline.js'
import * as ControlMode from "../../model/ControlMode.js";
import { OriginMarker } from "../threeview/SceneNode/OriginMarker.js"
import { MapObjectSceneNode } from "../threeview/SceneNode/MapObjectSceneNode.js"
import ThreeControlModeGuide from './ThreeControlModeGuide';
import TooltipedMenuIcon from "../commonControl/TooltipedMenuIcon";

export default {
    name: "ThreeRenderView",
    props: [],
    components: {
        ThreeControlModeGuide,
        TooltipedMenuIcon,
    },
    data() {
        return {        
            showControlGuide: false,
            controlGuideText: "", 
            controlMode: ControlMode,
            currentControlMode: null,
            unsubscribeStoreMutation: null,            
            showGridline: false,
            meshes: [],
        }
    },

    computed: {
    },

    methods: {
        init() {
            // DOM에서 가시화 캔버스를 검색한다.
            this.container = document.getElementById("three-container");
            this.containerSizeBefore = {x:0, y:0};            
            
            // 렌더러를 생성한다.
            this.renderer = new THREE.WebGLRenderer({antialias: true});            
            this.renderer.autoClear = false; // 오버레이 렌더링을 하려면 false로 설정해야 한다.    
            this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
            this.container.appendChild(this.renderer.domElement);

            // 카메라 생성
            this.cameraManager = new CameraManager(new Rect(this.container.clientWidth/-2, this.container.clientHeight/-2, this.container.clientWidth, this.container.clientHeight));            
                        
            // 가시화 노드 생성
            this.gridLine = new Gridline(this); // 그리드 라인
            this.mapObjectSceneNode = new MapObjectSceneNode(this); // 맵 경로 개체 가시화 노드
            this.coordAxes = new CoordAxes(this); // 좌표계                        
            this.originMarker = new OriginMarker(this); // 원점 가시화 노드

            // 화면 컨트롤러를 생성한다.
            this.controlManager = new ControlManager(this);           

            // 테스트            
            this.initSolid();            
        },

        initSolid() {
            const box = new THREE.Mesh(new THREE.BoxBufferGeometry(1, 1, 1), new THREE.MeshBasicMaterial( { color: '#FF5252', side: THREE.DoubleSide, emissive:0x000000, wireframe:true} ));
            box.position.set(0, 0, 0);
            this.meshes = [box];

            this.mapObjectSceneNode.updateData([...this.meshes]);
            this.fitMapToScene();
        },

        animate() {
            
            // Splitter Pane을 적용할 경우, Window Resize 변경 이벤트시 Container의 Size가 변경되지 않는 문제가 있어
            // 다음과 같이 매 렌더링 시 container size 변경 여부를 판단하기로 한다.            
            if(this.container.clientWidth == 0 || this.container.clientHeight == 0) {
                return;
            }

            if(this.container.clientWidth != this.containerSizeBefore.x || this.container.clientHeight != this.containerSizeBefore.y)
            {
                this.containerSizeBefore.x = this.container.clientWidth;
                this.containerSizeBefore.y = this.container.clientHeight;

                // 뷰포트와 카메라 프로젝트 크기 변경
                this.cameraManager.updateViewport(this.container);           

                // 렌더러 크기 갱신
                this.renderer.setSize(this.container.clientWidth, this.container.clientHeight, true);
            }

            requestAnimationFrame(this.animate);
            
            // 프레임버퍼, 뎊쓰 버퍼 등 초기화
            this.renderer.clear();

            // 가위 테스트를 활성화하면, 이후에 렌더링 시 가위 영역 안에만 그려진다.
            this.renderer.setScissorTest(true);

            // 메인씬 그리기
            this.mapObjectSceneNode.render(this.renderer, this.cameraManager);
            
            if(this.showGridline == true) {
                this.gridLine.render(this.renderer, this.cameraManager); 
            }

            this.renderer.clearDepth();
            
            this.originMarker.render(this.renderer, this.cameraManager);            
            this.controlManager.render(this.renderer);            

            // 좌표계 그리기            
            this.coordAxes.render(this.renderer, this.cameraManager.camera);            
        },        

        onWindowResize() {    
            //console.log("window resize invoked");            
        },     
        
        zoomIn() {
            this.cameraManager.zoomIn();
        },

        zoomOut(){
            this.cameraManager.zoomOut();
        },        
        
        fitMapToScene() {
            this.cameraManager.updateWorldRect(new Rect(-5,-5,10,10), true);
        },

        rotate(angleDegree) {
            this.cameraManager.rotate(angleDegree);
        },

        setControlMode(mode) {
            this.controlManager.setControlMode(mode);
        },

        showControlModeInfo(message) {                            
            this.showControlGuide = true;
            this.controlGuideText = message;
        },
        
        closeControlModeInfo() {
            this.showControlGuide = false;
            this.controlGuideText = "";
        },

        updateSceneData(meshes) {   
            this.meshes = [...meshes];
            this.mapObjectSceneNode.updateData([...this.meshes]);         
        },
    },

    created() {       
        window.addEventListener('resize', 
            () => {
                this.onWindowResize()
            });

        this.unsubscribeStoreMutation = this.$store.subscribe((mutation, state) => {            
        });

        this.$eventBus.$on('control-mode-changed', (mode) => {
            this.currentControlMode = mode;
        })
    },   

    mounted() {
        this.init();        

        this.animate();

        this.setControlMode(ControlMode.Rotation);
    },

    destroyed() {
        if(this.unsubscribeStoreMutation) {
            this.unsubscribeStoreMutation();
        }
    }

}
</script>
