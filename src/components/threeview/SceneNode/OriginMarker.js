
import * as THREE from 'three/build/three.module';
import { CameraUtil } from '../CameraUtil.js';
import { DrawUtil } from '../DrawUtil.js';

export class OriginMarker {
    constructor(renderManager) {               
        this.renderManager = renderManager;
        this.xAxisNode = DrawUtil.createPointCurveNode("xaxis", 2, 0xff0000);
        this.xAxisNode.material.depthTest = false;
        this.yAxisNode = DrawUtil.createPointCurveNode("yaxis", 2, 0x00ff00);
        this.yAxisNode.material.depthTest = false;
        this.zAxisNode = DrawUtil.createPointCurveNode("zaxis", 2, 0x0000ff);
        this.zAxisNode.material.depthTest = false;
        this.thisScene = new THREE.Scene();
        this.thisScene.add(this.xAxisNode);
        this.thisScene.add(this.yAxisNode);
        this.thisScene.add(this.zAxisNode);
    }

	render(renderer, cameraManager) {
        
        let oproj = CameraUtil.getViewportCoordinateZ(0, 0, 0, cameraManager.viewport, cameraManager.camera).setZ(0);
        let xproj = CameraUtil.getViewportCoordinateZ(1, 0, 0, cameraManager.viewport, cameraManager.camera).setZ(0);
        let yproj = CameraUtil.getViewportCoordinateZ(0, 1, 0, cameraManager.viewport, cameraManager.camera).setZ(0);        
        let zproj = CameraUtil.getViewportCoordinateZ(0, 0, 1, cameraManager.viewport, cameraManager.camera).setZ(0);       
        
        let x = oproj.clone().addScaledVector(new THREE.Vector3().subVectors(xproj, oproj).normalize(), 100);
        let y = oproj.clone().addScaledVector(new THREE.Vector3().subVectors(yproj, oproj).normalize(), 100);
        let z = oproj.clone().addScaledVector(new THREE.Vector3().subVectors(zproj, oproj).normalize(), 100);

        DrawUtil.updateVertices(this.xAxisNode, [oproj, x]);
        DrawUtil.updateVertices(this.yAxisNode, [oproj, y]);
        DrawUtil.updateVertices(this.zAxisNode, [oproj, z]);
        
		renderer.setViewport(cameraManager.canvasViewport.x, cameraManager.canvasViewport.y, cameraManager.canvasViewport.w, cameraManager.canvasViewport.h);        
        renderer.setScissor(cameraManager.canvasViewport.x, cameraManager.canvasViewport.y, cameraManager.canvasViewport.w, cameraManager.canvasViewport.h);        
        renderer.render(this.thisScene, cameraManager.canvasCamera);


	}

}