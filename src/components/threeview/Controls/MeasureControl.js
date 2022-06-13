import * as THREE from 'three/build/three.module';
import {CameraUtil} from '../CameraUtil';
import {DrawUtil} from '../DrawUtil'
import * as ControlMode from '../../../model/ControlMode.js';
import {Rect} from "../../../model/Rect.js"
import {CSG} from "../../../CSG/CSG.js";

export class MeasureControl {

	constructor(renderManager) {
		this.renderManager = renderManager;
		this.thisScene = new THREE.Scene();
		this.points = [];
		this.position1 = null;
		this.fontSize = 16;
		this.textSizes = [];
		this.guideTextRect = new Rect(0,0,0,0);

		// 픽킹한 점들을 잇는 포인트 커브 노드 생성
		this.segmentsNode = DrawUtil.createPointCurveNode("segments", 100, new THREE.Color(0x0000ff));		
		this.segmentsNode.material.depthTest = false;
		this.segmentsNode.material.needsUpdate = true;				
		this.thisScene.add(this.segmentsNode);

		// 픽킹한 점들을 표시하기 위한 노드 생성
		this.knotsNode = DrawUtil.createPointsNode("knots", 100, 10, 0x0000ff);		
		this.knotsNode.material.depthTest = false;		
		this.knotsNode.material.needsUpdate = true;		
		this.knotsNode.frustumCulled = false;		
		this.thisScene.add(this.knotsNode);	

		// 마우스 이동 시 마지막 점과 마우스 커서간의 거리 표시를 위한 노드
		this.guideLineNode = DrawUtil.createDashedCurveNode("curve", 3, 0x0000ff, 1, 3, 1);
        this.guideLineNode.material.depthTest = false;
        this.thisScene.add(this.guideLineNode);
	}

	get Mode() { 
        return ControlMode.Measure;
    }

    getPointInWorld() {
        return this.points.map(x => CameraUtil.getWorldCoordinateZ(x.x, x.y, 0, this.renderManager.cameraManager.viewport, this.renderManager.cameraManager.camera));
    }

    getPosition1InWorld() {
        return this.position1 ? CameraUtil.getWorldCoordinateZ(this.position1.x, this.position1.y, 0, this.renderManager.cameraManager.viewport, this.renderManager.cameraManager.camera) : null;
    }

	onModeEntered() {
		this.reset();        
        this.renderManager.showControlModeInfo('Press Enter key to confirm or press ESC to abort');
    }

    setInitialData(data) {

    }

	reset() {
        this.points = [];
		this.renderManager.closeControlModeInfo();
		DrawUtil.updateVertices(this.segmentsNode, []);
		DrawUtil.updateVertices(this.knotsNode, []);
    }	

	render(renderer) {
		renderer.setViewport(this.renderManager.cameraManager.viewport.x, this.renderManager.cameraManager.viewport.y, this.renderManager.cameraManager.viewport.w, this.renderManager.cameraManager.viewport.h);
        renderer.setScissor(this.renderManager.cameraManager.viewport.x, this.renderManager.cameraManager.viewport.y, this.renderManager.cameraManager.viewport.w, this.renderManager.cameraManager.viewport.h);
        renderer.render(this.thisScene, this.renderManager.cameraManager.camera);
	}

	updateGuideDrawing() {
        const pointInWorld = this.getPointInWorld();
        const position1InWorld = this.getPosition1InWorld();

		if(pointInWorld.length > 0 && position1InWorld != null) {
			let p0 = pointInWorld[0].clone();
			let p1 = position1InWorld.clone();
            let p2 = pointInWorld[pointInWorld.length-1].clone();
			DrawUtil.updateVertices(this.guideLineNode, [p0, p1, p2]);
			this.guideLineNode.computeLineDistances();
		}
		else {
			DrawUtil.updateVertices(this.guideLineNode, []);
			this.guideLineNode.computeLineDistances();
		}
	}
	
	updateDrawing() {
		const pointInWorld = this.getPointInWorld();
        if(pointInWorld.length < 3) {
            // draw lines        
            DrawUtil.updateVertices(this.segmentsNode, pointInWorld);

            // draw knots
            DrawUtil.updateVertices(this.knotsNode, pointInWorld);
        }
        else {
            let polygon = [...pointInWorld, pointInWorld[0]];
            // draw lines        
            DrawUtil.updateVertices(this.segmentsNode, polygon);

            // draw knots
            DrawUtil.updateVertices(this.knotsNode, polygon);
        }
	}

	handleMouseDown = (event) => {
		if (event.button == 0 /* LEFT */) {
			this.points.push(new THREE.Vector2(event.clientX, event.clientY));

			this.updateDrawing();
			this.position1 = null;
			this.updateGuideDrawing();
		}
	}

	handleMouseMove (event) {
		if(this.points.length > 0) {
			this.position1 = new THREE.Vector2(event.clientX, event.clientY);
			this.updateGuideDrawing();
		}
	}

	handleMouseUp  (event) {		
	}

	handleMouseWheel  (event) {
		// do nothing
	}

    getPrismGeometry(vertices, bottomOffset, topOffset) {

        const verticesArray = [];        
        const indexArray = [];

        for(let i=0; i < vertices.length; i++) {
            verticesArray.push(new THREE.Vector3().addVectors(vertices[i], bottomOffset).x);
            verticesArray.push(new THREE.Vector3().addVectors(vertices[i], bottomOffset).y);
            verticesArray.push(new THREE.Vector3().addVectors(vertices[i], bottomOffset).z);             
            verticesArray.push(new THREE.Vector3().addVectors(vertices[i], topOffset).x);
            verticesArray.push(new THREE.Vector3().addVectors(vertices[i], topOffset).y);
            verticesArray.push(new THREE.Vector3().addVectors(vertices[i], topOffset).z);
        }
        
        // top
        for(let i=0; i<vertices.length-2; i++) {
            indexArray.push(2*(0) + 1);
            indexArray.push(2*(i + 1) + 1);
            indexArray.push(2*(i + 2) + 1);                        
        }

        // side
        for(let i=0; i<vertices.length; i++) {
            let j = (i + 1) % vertices.length;

            // i1-j1 -- top
            // | /|
            // |/ |
            // i0-j0 -- bottom            
            indexArray.push(i*2 + 0);            
            indexArray.push(j*2 + 1);
            indexArray.push(i*2 + 1);

            indexArray.push(i*2 + 0);
            indexArray.push(j*2 + 0);            
            indexArray.push(j*2 + 1);            
        }

        // bottom
        for(let i=0; i<vertices.length-2; i++) {
            indexArray.push(2*(0) + 0);                        
            indexArray.push(2*(i + 2) + 0);
            indexArray.push(2*(i + 1) + 0);
        }

        console.log('verticesArray', verticesArray);
        console.log('indexArray', indexArray);


        const geometry = new THREE.BufferGeometry()
            .setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(verticesArray), 3))         
            .setIndex(indexArray);

        return geometry;
    }

    clipSolid() {

        if(this.points.length < 3) {
            return false;
        }

        const pointInWorld = this.getPointInWorld();
        
        const p0 = CameraUtil.getWorldCoordinateZ(0, 0, 0, this.renderManager.cameraManager.viewport, this.renderManager.cameraManager.camera);
        const p1 = CameraUtil.getWorldCoordinateZ(0, 0, 1, this.renderManager.cameraManager.viewport, this.renderManager.cameraManager.camera);
        const p2 = CameraUtil.getWorldCoordinateZ(0, 0, -1, this.renderManager.cameraManager.viewport, this.renderManager.cameraManager.camera);        

        console.log(p0, p1, p2);

        const bottomOffset = new THREE.Vector3().subVectors(p1,p0).multiplyScalar(0.5);
        const topOffset = new THREE.Vector3().subVectors(p2,p0).multiplyScalar(0.5);

        console.log(`bottomOffset: ${bottomOffset.x}, ${bottomOffset.y}, ${bottomOffset.z}`);
        console.log(`topOffset: ${topOffset.x}, ${topOffset.y}, ${topOffset.z}`);
        console.log(`points:`, pointInWorld);

        const geometry = this.getPrismGeometry(pointInWorld, bottomOffset, topOffset);
        const prismMesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial( { color: '#2979FF', side: THREE.DoubleSide, emissive:0x000000, wireframe:true, transparent:false, opacity:0.5 } ));

        const csg = new CSG();
        csg.subtract([this.renderManager.meshes[0], prismMesh]);
        //csg.union([box, sphere, sphereB]);
        //csg.intersect([box, sphere]);

        const resultMesh = csg.toMesh();

        const edges = new THREE.EdgesGeometry( resultMesh.geometry );
        const line = new THREE.LineSegments( edges, new THREE.LineBasicMaterial( { color: 0xffffff } ) );

        this.renderManager.updateSceneData([resultMesh, line]);

        return true;
    }

	handleKeyDown  (event) {
		if(event.key === "Escape") {            
			this.points = [];
			this.updateDrawing();
			this.position1 = null;
			this.updateGuideDrawing();
            this.renderManager.controlManager.restoreControlMode();
		}
        else if(event.key === "Enter") {
            if(this.clipSolid()) {
                this.points = [];
                this.updateDrawing();
                this.position1 = null;
                this.updateGuideDrawing();
            }
		}
	}

	handleKeyUp  (event) {
        // do nothing
    }

    handleDoubleClick(event) {
        // do nothing
    }
}