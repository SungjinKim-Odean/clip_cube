import * as THREE from 'three/build/three.module';
import {CameraUtil} from '../CameraUtil.js';
import * as ControlMode from '../../../model/ControlMode.js';

export class RotationControl {

	constructor(renderManager) {

		this.renderManager = renderManager;
		this.oldPosition = new THREE.Vector2();
		this.newPosition = new THREE.Vector2();
		this.isRotating = false;
	}
	
	get Mode() { 
        return ControlMode.Rotation;
    }

	onModeEntered() {
    }

    setInitialData(data) {
    }

	reset() {        
		this.isRotating = false;
    }	

	render(renderer) {
    }

	handleMouseDown = (event) => {

		if (event.button == 0 /* LEFT */ ||
			event.button == 2 /* RIGHT */) {
			this.oldPosition.set(event.clientX, event.clientY);
			this.isRotating = true;
		}
		else {
			this.isRotating = false;
		}
	}

	handleMouseMove (event) {		

		if (this.isRotating == true) {
			this.newPosition.set(event.clientX, event.clientY);
			CameraUtil.rotate3d(this.renderManager.cameraManager.camera, this.renderManager.cameraManager.focalPosition, this.renderManager.cameraManager.viewport, this.oldPosition, this.newPosition);
			this.oldPosition.copy(this.newPosition);
		}
	}

	handleMouseUp  (event) {
		this.isRotating = false;
	}

	handleMouseWheel  (event) {
		// do nothing
	}

	handleKeyDown  (event) {
		if(event.key === "Escape") {            
            this.renderManager.controlManager.restoreControlMode();
		}
	}

	handleKeyUp  (event) {
        // do nothing
    }

    handleDoubleClick(event) {
        // do nothing
    }
}