import * as THREE from 'three/build/three.module';
import * as ControlMode from '../../../model/ControlMode.js';
import { DrawUtil } from "../DrawUtil.js";
import { SelectionBox } from 'three/examples/jsm/interactive/SelectionBox';
import {CameraUtil} from "../CameraUtil.js";

export class PickControl {

	constructor(renderManager) {
		
		this.renderManager = renderManager;			
		this.rayCaster = new THREE.Raycaster();				

		this.ctrlPressed = false;
		this.isDragging = false;
		this.position0 = null;
		this.position1 = null;
		this.leftPressed = false;

		this.thisScene = new THREE.Scene();        
        this.rectNode = DrawUtil.createDashedCurveNode("rectangle", 5, 0x0000ff, 1, 3, 1);
        this.rectNode.material.depthTest = false;
        this.thisScene.add(this.rectNode);

		this.selectionBox = new SelectionBox(this.renderManager.cameraManager.camera, this.renderManager.mapObjectSceneNode.thisScene);
		//this.helper = new SelectionHelper(this.selectionBox, this.renderManager.renderer, 'selectBox');
        this.selectedObjects = [];
        this.position0InWorld = null;
	}	

	get Mode() { 
        return ControlMode.Pick;
    }

	onModeEntered() {
        //console.log('pick control entered');
		this.reset();        
	}

    setInitialData(data) {
        //console.log('pick control setInitialData', data);
        if(data) {
            this.reset();
            
            if('selectedObjects' in data) {
                this.selectedObjects = [...data.selectedObjects];
                this.renderManager.mapObjectSceneNode.updateScene();
            }
        }
    }

	reset() {
		this.ctrlPressed = false;
		this.isDragging = false;
		this.position0 = null;
		this.position1 = null;
        this.selectedObjects = [];
        this.position0InWorld = null;
    }
	
	pick(event) {
        let cursor = new THREE.Vector2(event.clientX, event.clientY);
		let normalizaedPosition = new THREE.Vector2(-1 + 2 * cursor.x / this.renderManager.cameraManager.viewport.dx, -1 + 2 * (this.renderManager.cameraManager.viewport.dy-cursor.y) / this.renderManager.cameraManager.viewport.dy);		
        this.rayCaster.setFromCamera(normalizaedPosition, this.renderManager.cameraManager.camera);		
		let picked = false;
		let pickedObject = null;
        this.position0InWorld = CameraUtil.getWorldCoordinate(event.clientX, event.clientY, this.renderManager.cameraManager.viewport, this.renderManager.cameraManager.camera).setZ(0);

		if(this.ctrlPressed == true) {
			let pickedObjects = this.rayCaster.intersectObjects([...this.renderManager.mapObjectSceneNode.thisScene.children].reverse(), false);
			if(pickedObjects.length > 0) {
				// sort by distance

				// 픽킹된 개체를 선택 상태로 설정
				pickedObjects[0].object.userData.isSelected = true;
				// 화면 갱신
				this.renderManager.mapObjectSceneNode.updateScene();
				picked = true;
				pickedObject = pickedObjects[0].object.userData;

                if(!this.selectedObjects.some(x => x.id === pickedObject.id)) {
                    this.selectedObjects.push(pickedObject);
                }
			}
			else {
				/* do nothing */				
			}
		}
		else {
			let pickedObjects = this.rayCaster.intersectObjects([...this.renderManager.mapObjectSceneNode.thisScene.children].reverse());
            //console.log('pick control picked', pickedObjects);
			if(pickedObjects.length > 0) {
                // 픽킹된 개체만 선택 상태로 설정.
                this.renderManager.mapObjectSceneNode.thisScene.children.forEach((el) => el.userData.isSelected = false);				
                pickedObjects[0].object.userData.isSelected = true;
                // 화면 갱신
                this.renderManager.mapObjectSceneNode.updateScene();
                picked = true;
                pickedObject = pickedObjects[0].object.userData;

                this.selectedObjects = [pickedObject];
			}
			else {
                this.selectedObjects = [];

				// 전체 선택 해제
				this.renderManager.mapObjectSceneNode.thisScene.children.forEach((el) => el.userData.isSelected = false);
				// 화면 갱신
				this.renderManager.mapObjectSceneNode.updateScene();
			}
		}        

		return {picked,pickedObject};
	}	

	pickRect() {

		if(this.position0 != null && this.position1 != null) {
			let viewRect = this.renderManager.cameraManager.viewport;
			let normalizaedPosition1 = new THREE.Vector2(-1 + 2 * this.position0.clientX / viewRect.dx, 1 - 2 * this.position0.clientY / viewRect.dy);
			let normalizaedPosition2 = new THREE.Vector2(-1 + 2 * this.position1.clientX / viewRect.dx, 1 - 2 * this.position1.clientY / viewRect.dy);
			this.selectionBox.startPoint.set(normalizaedPosition1.x, normalizaedPosition1.y, 0.5);	
			this.selectionBox.endPoint.set(normalizaedPosition2.x, normalizaedPosition2.y, 0.5);
			const pickedObjects = this.selectionBox.select();
			let picked = false;
	
			if(this.ctrlPressed == true) {
				let pickedObjects = this.selectionBox.select();
				if(pickedObjects.length > 0) {
                    pickedObjects.forEach(el => {
                        if(!this.selectedObjects.some(x => x.id === el.userData.id)) {
                            this.selectedObjects.push(el.userData);
                        }
                    });

					pickedObjects.forEach((el) => el.userData.isSelected = true);                    
					
					// 화면 갱신
					this.renderManager.mapObjectSceneNode.updateScene();
					picked = true;
				}
				else {
					/* do nothing */				
				}
			}
			else {									
				let pickedObjects = this.selectionBox.select();
				if(pickedObjects.length > 0) {
					// sort by distance
	
					// 픽킹된 개체만 선택 상태로 설정.
					this.renderManager.mapObjectSceneNode.thisScene.children.forEach((el) => el.userData.isSelected = false);

                    this.selectedObjects = pickedObjects.map(el => el.userData);
					
                    pickedObjects.forEach((el) => el.userData.isSelected = true);

					// 화면 갱신
					this.renderManager.mapObjectSceneNode.updateScene();
					picked = true;
				}
				else {
                    this.selectedObjects = [];
					// 전체 선택 해제
					this.renderManager.mapObjectSceneNode.thisScene.children.forEach((el) => el.userData.isSelected = false);
					// 화면 갱신
					this.renderManager.mapObjectSceneNode.updateScene();
				}
			}
	
			return picked;
		}
	}	

	render(renderer) {

		if(this.position0 != null && this.position1 != null) {
            renderer.setViewport(this.renderManager.cameraManager.canvasViewport.x, this.renderManager.cameraManager.canvasViewport.y, this.renderManager.cameraManager.canvasViewport.w, this.renderManager.cameraManager.canvasViewport.h);
            renderer.setScissor(this.renderManager.cameraManager.canvasViewport.x, this.renderManager.cameraManager.canvasViewport.y, this.renderManager.cameraManager.canvasViewport.w, this.renderManager.cameraManager.canvasViewport.h);
            renderer.render(this.thisScene, this.renderManager.cameraManager.canvasCamera);
        }
    }

	updateDrawing() {
		if(this.position0 != null && this.position1 != null) {
            let minx = Math.min(this.position0.clientX, this.position0.clientX);
            let maxx = Math.max(this.position1.clientX, this.position1.clientX);
            let miny = Math.min(this.renderManager.cameraManager.canvasViewport.h-this.position0.clientY, this.renderManager.cameraManager.canvasViewport.h-this.position1.clientY);
            let maxy = Math.max(this.renderManager.cameraManager.canvasViewport.h-this.position0.clientY, this.renderManager.cameraManager.canvasViewport.h-this.position1.clientY);                

            let points = [            
                new THREE.Vector3(minx, miny, 0),
                new THREE.Vector3(maxx, miny, 0),
                new THREE.Vector3(maxx, maxy, 0),
                new THREE.Vector3(minx, maxy, 0),
                new THREE.Vector3(minx, miny, 0),
            ];
            DrawUtil.updateVertices(this.rectNode, points);        
            this.rectNode.computeLineDistances();
		}
	}

	handleMouseDown = (event) => {

		if (event.button == 0 /* LEFT */) {	
			this.leftPressed = true;

			const {picked, pickedObject} = this.pick(event);
			if(picked == true) {				
				this.isDragging = false;
				this.position0 = null;
				this.position1 = null;
				this.updateDrawing();
				this.renderManager.$emit('object-picked', pickedObject); 
			}
			else {
				this.isDragging = true;
				this.position0 = event;
				this.position1 = null;
				this.updateDrawing();

				const pickPosition = CameraUtil.getWorldCoordinate(event.clientX, event.clientY, this.renderManager.cameraManager.viewport, this.renderManager.cameraManager.camera).setZ(0);
				this.renderManager.$emit('map-clicked', pickPosition);
			}
		}
	}

	handleMouseMove (event) {		
		if(this.leftPressed == true) {
            if(this.isDragging == true) {			
				this.position1 = event;
				this.updateDrawing();
			}
		}
	}

	handleMouseUp  (event) {
		if (event.button == 0 /* LEFT */) {	
			this.leftPressed = false;
		}

		if(this.isDragging == true) {
			this.pickRect();
		}

		this.isDragging = false;
		this.position0 = null;
		this.position1 = null;
		this.updateDrawing();
	}

	handleMouseWheel  (event) {
		// do nothing
	}

	handleKeyDown  (event) {		
		if(event.which == 17) {
			this.ctrlPressed = true;
		}

        switch(event.key) {
        }
	}

	handleKeyUp  (event) {
		if(event.which == 17) {
			this.ctrlPressed = false;
		}
    }

    handleDoubleClick(event) {
        let cursor = new THREE.Vector2(event.clientX, event.clientY);        
		let normalizaedPosition = new THREE.Vector2(-1 + 2 * cursor.x / this.renderManager.cameraManager.viewport.dx, -1 + 2 * (this.renderManager.cameraManager.viewport.dy-cursor.y) / this.renderManager.cameraManager.viewport.dy);		
		this.rayCaster.setFromCamera(normalizaedPosition, this.renderManager.cameraManager.camera);		
		
        let pickedObjects = this.rayCaster.intersectObjects(this.renderManager.mapObjectSceneNode.thisScene.children, false);
        if(pickedObjects.length > 0 && pickedObjects[0].object.userData) {
            // sort by distance
      
            this.renderManager.$emit('object-double-clicked', pickedObjects[0].object.userData);            
        }
    }
}