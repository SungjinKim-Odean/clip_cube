import * as THREE from 'three/build/three.module';
import { Rect } from '../../../model/Rect.js';
import { DrawUtil } from '../DrawUtil.js';
import { VertexNormalsHelper } from 'three/examples/jsm/helpers/VertexNormalsHelper.js';
import { VertexTangentsHelper } from 'three/examples/jsm/helpers/VertexTangentsHelper.js';

export class MapObjectSceneNode {
    constructor(renderManager) {
        this.renderManager = renderManager;
        this.thisScene = new THREE.Scene();
    }
    
    updateData(meshes) {
        this.thisScene.clear();

        const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.6 );
        directionalLight.position.set( 1, 1, 1 ).normalize();
        this.thisScene.add( directionalLight );

        const light = new THREE.AmbientLight( 0x404040 ); // soft white light
        this.thisScene.add( light );

        meshes.forEach(x => {
            //x.geometry.computeVertexNormals();            
            this.thisScene.add(x);
            //this.thisScene.add( new VertexNormalsHelper( x, 0.1, 0x0000ff ) );
        });
    }
    
    render(renderer, cameraManager) {
        renderer.setViewport(cameraManager.viewport.x, cameraManager.viewport.y, cameraManager.viewport.w, cameraManager.viewport.h);
        renderer.setScissor(cameraManager.viewport.x, cameraManager.viewport.y, cameraManager.viewport.w, cameraManager.viewport.h);
        renderer.render(this.thisScene, cameraManager.camera);
    }

    updateScene() {
        for(let i=0; i<this.thisScene.children.length; i++) {            
        }        
    }
}