
import * as THREE from 'three/build/three.module'

export class CameraUtil {

	static rotate3d (camera, focalPosition, viewport, oldPosition, newPosition) {
		if (oldPosition.distanceTo(newPosition) == 0)
			return false;

		let vRight = new THREE.Vector3();
		let vUp = new THREE.Vector3();
		let vToward = new THREE.Vector3();
		camera.matrix.extractBasis(vRight, vUp, vToward);

		let eyePosition = camera.position.clone();
		let vCenterToEye = new THREE.Vector3().subVectors(eyePosition, focalPosition);

		var deltaPixel = new THREE.Vector2().subVectors(newPosition, oldPosition);
		let deltaRad = new THREE.Vector2(Math.PI * 2 * deltaPixel.x / viewport.dx, -Math.PI * 2 * deltaPixel.y / viewport.dy);

		let rotationMat = new THREE.Matrix4().makeRotationAxis(vRight, deltaRad.y).premultiply(new THREE.Matrix4().makeRotationAxis(vUp, -deltaRad.x));
		let newEyePos = vCenterToEye.clone().applyMatrix4(rotationMat).applyMatrix4(new THREE.Matrix4().makeTranslation(focalPosition.x, focalPosition.y, focalPosition.z));
		let vNewUp = vUp.clone().applyMatrix4(rotationMat);

		let modelViewMat = new THREE.Matrix4().lookAt(newEyePos, focalPosition, vNewUp).premultiply(new THREE.Matrix4().makeTranslation(newEyePos.x, newEyePos.y, newEyePos.z));
		camera.applyMatrix4(camera.matrix.clone().invert().premultiply(modelViewMat));

		return true;
	}

	static rotate2d (camera, focalPosition, viewport, oldPosition, newPosition) {
		if (oldPosition.distanceTo(newPosition) == 0)
			return false;

		let vRight = new THREE.Vector3();
		let vUp = new THREE.Vector3();
		let vToward = new THREE.Vector3();
		camera.matrix.extractBasis(vRight, vUp, vToward);

		let eyePosition = camera.position.clone();
		let vCenterToEye = new THREE.Vector3().subVectors(eyePosition, focalPosition);

		var deltaPixel = new THREE.Vector2().subVectors(newPosition, oldPosition);
		let deltaRad = new THREE.Vector2(Math.PI * 2 * deltaPixel.x / viewport.dx, Math.PI * 2 * deltaPixel.y / viewport.dy);

		let rotationMat = new THREE.Matrix4().makeRotationAxis(vToward, deltaRad.y);
		let newEyePos = vCenterToEye.clone().applyMatrix4(rotationMat).applyMatrix4(new THREE.Matrix4().makeTranslation(focalPosition.x, focalPosition.y, focalPosition.z));
		let vNewUp = vUp.clone().applyMatrix4(rotationMat);

		let modelViewMat = new THREE.Matrix4().lookAt(newEyePos, focalPosition, vNewUp).premultiply(new THREE.Matrix4().makeTranslation(newEyePos.x, newEyePos.y, newEyePos.z));
		camera.applyMatrix4(camera.matrix.clone().invert().premultiply(modelViewMat));

		return true;
	}

	static rotate (camera, focalPosition, degree) {		
		let vRight = new THREE.Vector3();
		let vUp = new THREE.Vector3();
		let vToward = new THREE.Vector3();
		camera.matrix.extractBasis(vRight, vUp, vToward);

		let eyePosition = camera.position.clone();
		let vCenterToEye = new THREE.Vector3().subVectors(eyePosition, focalPosition);
		
		let deltaRad = degree / 180 * Math.PI;

		let rotationMat = new THREE.Matrix4().makeRotationAxis(vToward, deltaRad);
		let newEyePos = vCenterToEye.clone().applyMatrix4(rotationMat).applyMatrix4(new THREE.Matrix4().makeTranslation(focalPosition.x, focalPosition.y, focalPosition.z));
		let vNewUp = vUp.clone().applyMatrix4(rotationMat);

		let modelViewMat = new THREE.Matrix4().lookAt(newEyePos, focalPosition, vNewUp).premultiply(new THREE.Matrix4().makeTranslation(newEyePos.x, newEyePos.y, newEyePos.z));
		camera.applyMatrix4(camera.matrix.clone().invert().premultiply(modelViewMat));

		return true;
	}

	static pan(camera, viewport, oldPosition, newPosition) {
		if (oldPosition.distanceTo(newPosition) == 0)
			return false;		
		
		let diff = new THREE.Vector2().subVectors(newPosition, oldPosition).negate();		
		let newOffsetX = camera.view.offsetX + diff.x/viewport.dx;
		let newOffsetY = camera.view.offsetY + diff.y/viewport.dy;
		
		// 뷰 오프셋은 정규화한 값으로 정의하기로 한다.
		camera.setViewOffset(1, 1, newOffsetX, newOffsetY, 1, 1);
		return true;
	}

    static zoom(camera, factor, cursor, viewport) {
		// 커서 위치를 기준으로 화면을 확대한다.
		// 그러기 위해서는 줌팩터와 함께 오프셋 값을 조정해야 한다.
		// 줌 전후에 변하지 않는 것은 현재 커서의 월드 좌표라는 사실을 이용해 새로운 오프셋값을 계산한다.
		let newOffsetX = factor * camera.view.offsetX + (1-factor) * (0.5 - cursor.x/viewport.dx);
		let newOffsetY = factor * camera.view.offsetY + (1-factor) * (0.5 - cursor.y/viewport.dy);
		camera.zoom *= factor;

		// 뷰 오프셋은 정규화한 값으로 정의하기로 한다.
		camera.setViewOffset(1, 1, newOffsetX, newOffsetY, 1, 1);
	}

	static getWorldCoordinate(clientX, clientY, viewport, camera) {
        return new THREE.Vector3(-1 + 2 * clientX / viewport.dx, -1 + 2 * (viewport.dy-clientY) / viewport.dy, 0).unproject(camera);
    }

    static getWorldCoordinateZ(clientX, clientY, z, viewport, camera) {
        return new THREE.Vector3(-1 + 2 * clientX / viewport.dx, -1 + 2 * (viewport.dy-clientY) / viewport.dy, z).unproject(camera);
    }

	static getCanvasCoordinate(worldX, worldY, mapWorldRect, meterPerPixel) {        
        return new THREE.Vector3((worldX - mapWorldRect.minx) / meterPerPixel, (worldY - mapWorldRect.miny) / meterPerPixel, 0);
    }	

	// 좌하단이 원점이 되는 뷰포트 좌표값을 반환한다.
	static getViewportCoordinate(x, y, viewport, camera) {
        let ndcPos = new THREE.Vector3(x, y, 0).project(camera);
		return new THREE.Vector3((ndcPos.x + 1)/2 * viewport.dx, (ndcPos.y + 1)/2 * viewport.dy, 0);
    }

    static getViewportCoordinateZ(x, y, z, viewport, camera) {
        let ndcPos = new THREE.Vector3(x, y, z).project(camera);
		return new THREE.Vector3((ndcPos.x + 1)/2 * viewport.dx, (ndcPos.y + 1)/2 * viewport.dy, 0);
    }
}