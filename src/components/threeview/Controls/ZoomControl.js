import * as THREE from 'three/build/three.module'
import {CameraUtil} from '../CameraUtil.js'
import * as ControlMode from '../../../model/ControlMode.js';

export class ZoomControl {

	constructor(renderManager) {
		this.renderManager = renderManager;
	}

	get Mode() { 
        return ControlMode.Zoom;
    }

	onModeEntered() {
    }

    setInitialData(data) {
    }
	
	reset() {        		
    }

	render(renderer) {
    }

	handleMouseDown (event) {

		// do nothing
	}

	handleMouseMove (event) {

		// do nothing
	}

	handleMouseUp  (event) {
		// do nothing
	}

	handleMouseWheel  (event) {		
		CameraUtil.zoom(this.renderManager.cameraManager.camera, event.deltaY > 0 ? 0.9 : 1.1, new THREE.Vector2(event.clientX, event.clientY), this.renderManager.cameraManager.viewport);		
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