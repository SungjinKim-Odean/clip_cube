import * as THREE from 'three/build/three.module';
import * as ControlMode from '../../../model/ControlMode.js';
import {CameraUtil} from '../CameraUtil.js';

export class PanControl {

	constructor(renderManager) {

		this.renderManager = renderManager;
		this.oldPosition = new THREE.Vector2();
		this.newPosition = new THREE.Vector2();
		this.isPanning = false;
	}	

	get Mode() { 
        return ControlMode.Pan;
    }

	onModeEntered() {
    }

    setInitialData(data) {
    }
 

	render(renderer) {
    }

	reset() {
        this.isPanning = false;
    }

	handleMouseDown (event) {		

		if (event.button == 0 /* LEFT */ ||
			event.button == 2 /* RIGHT */) {
			this.oldPosition.set(event.clientX, event.clientY);
			this.isPanning = true;
		}
		else {
			this.isPanning = false;
		}
	}

	handleMouseMove (event) { 

		if (this.isPanning == true) {
			this.newPosition.set(event.clientX, event.clientY);

			CameraUtil.pan(this.renderManager.cameraManager.camera, this.renderManager.cameraManager.viewport, this.oldPosition, this.newPosition);
			this.oldPosition.copy(this.newPosition);
		}
	}

	handleMouseUp  (event) {
		this.isPanning = false;
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