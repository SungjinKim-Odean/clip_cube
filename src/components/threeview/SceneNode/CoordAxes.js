
import * as THREE from 'three/build/three.module';
import { Rect } from '../../../model/Rect.js';
import { DrawUtil } from '../DrawUtil.js';

export class CoordAxes {
	constructor(renderManager) {
		this.renderManager = renderManager;

		// 좌하단에 뷰포트를 설정한다.
		this.viewport = new Rect(0, 0, 200, 200);
		this.scene = new THREE.Scene();    
		this.camera = new THREE.OrthographicCamera(this.viewport.dx/-2, this.viewport.dx/2, this.viewport.dy/2, this.viewport.dy/-2, 0.1, this.viewport.radius * 3);           
		this.camera.position.set(this.viewport.cx, this.viewport.cy, this.viewport.radius);
		this.camera.lookAt(this.viewport.cx, this.viewport.cy, 0);

		let axis_length = this.viewport.dx/4;
		let axis_width = axis_length / 20;
		let origin = new THREE.Vector3(0, 0, 0);
		this.scene.add(DrawUtil.createMeshNode(DrawUtil.getCylindricalArrowGeometry(origin, origin.clone().addScaledVector(new THREE.Vector3(1, 0, 0), axis_length), axis_width), new THREE.Color(0xff0000), "coordx"));
		this.scene.add(DrawUtil.createMeshNode(DrawUtil.getCylindricalArrowGeometry(origin, origin.clone().addScaledVector(new THREE.Vector3(0, 1, 0), axis_length), axis_width), new THREE.Color(0x00ff00), "coordy"));
		this.scene.add(DrawUtil.createMeshNode(DrawUtil.getCylindricalArrowGeometry(origin, origin.clone().addScaledVector(new THREE.Vector3(0, 0, 1), axis_length), axis_width), new THREE.Color(0x0000ff), "coordz"));
	}

	render(renderer, mainCamera) {

		let right = new THREE.Vector3();
		let up = new THREE.Vector3();
		let toward = new THREE.Vector3();
		mainCamera.matrix.extractBasis(right, up, toward);
		let forward = toward.clone().negate();

		let target = new THREE.Vector3(0,0,0);
		let eye = target.clone().addScaledVector(forward, this.viewport.radius * -1);
		let modelViewMat = new THREE.Matrix4().lookAt(eye, target, up).premultiply(new THREE.Matrix4().makeTranslation(eye.x, eye.y, eye.z));
		
		this.camera.applyMatrix4(this.camera.matrix.clone().invert().premultiply(modelViewMat));

		renderer.setViewport(this.viewport.x, this.viewport.y, this.viewport.w, this.viewport.h);
		renderer.setScissor(this.viewport.x, this.viewport.y, this.viewport.w, this.viewport.h);
		renderer.render(this.scene, this.camera);
	}
}