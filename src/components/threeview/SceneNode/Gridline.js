import * as THREE from 'three/build/three.module';
import { DrawUtil } from '../DrawUtil.js';

export class Gridline {
    constructor(renderManager) {   
        this.renderManager = renderManager;
        this.thisScene = new THREE.Scene();
    }

    updateRect(rect, color, gridUnitMeter)
    {
        this.thisScene.clear();

        // 원점 기준으로 가시화한다.
        let grids = [];       
        for(let x = 0; x >= rect.minx; x -= gridUnitMeter) {
            grids.push([new THREE.Vector3(x, rect.miny, 0), new THREE.Vector3(x, rect.maxy, 0)]);
        }

        for(let x = gridUnitMeter; x <= rect.maxx; x+= gridUnitMeter) {
            grids.push([new THREE.Vector3(x, rect.miny, 0), new THREE.Vector3(x, rect.maxy, 0)]);
        }

        for(let y = 0; y >= rect.miny; y -= gridUnitMeter) {
            grids.push([new THREE.Vector3(rect.minx, y, 0), new THREE.Vector3(rect.maxx, y, 0)]);
        }

        for(let y = gridUnitMeter; y <= rect.maxy; y += gridUnitMeter) {
            grids.push([new THREE.Vector3(rect.minx, y, 0), new THREE.Vector3(rect.maxx, y, 0)]);
        }

        var gridNode = new THREE.Object3D();
        for(let i=0; i<grids.length; i++) {
            let lineNode = DrawUtil.createLineNode(grids[i], color, 2);
            lineNode.material.depthTest = true;
            gridNode.add(lineNode);
        }        

        this.thisScene.add(gridNode);
    }

    render(renderer, cameraManager) {
        renderer.setViewport(cameraManager.viewport.x, cameraManager.viewport.y, cameraManager.viewport.w, cameraManager.viewport.h);
        renderer.setScissor(cameraManager.viewport.x, cameraManager.viewport.y, cameraManager.viewport.w, cameraManager.viewport.h);
        renderer.render(this.thisScene, cameraManager.camera);
    }
}