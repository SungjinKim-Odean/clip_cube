import { EventDispatcher }  from 'three/build/three.module';
import { RotationControl } from './Controls/RotationControl.js';
import { ZoomControl } from './Controls/ZoomControl.js';
import { PanControl } from './Controls/PanControl.js';
import { PickControl } from './Controls/PickControl.js';
import { MeasureControl } from './Controls/MeasureControl.js';
import * as ControlMode from '../../model/ControlMode.js';

var ControlManager = function (renderManager) {
	
	var scope = this;

	// 오프셋 값 초기화
	if(renderManager.cameraManager.camera.view == null) {
		let w = renderManager.cameraManager.camera.right - renderManager.cameraManager.camera.left;
		let h = renderManager.cameraManager.camera.top - renderManager.cameraManager.camera.bottom;
		renderManager.cameraManager.camera.setViewOffset(w, h, 0, 0, w, h);
	}

	this.renderManager = renderManager;	
	this.domElement = renderManager.renderer.domElement;
	this.controls = {}
	this.controls[ControlMode.Rotation] = new RotationControl(renderManager);
	this.controls[ControlMode.Zoom] = new ZoomControl(renderManager);
	this.controls[ControlMode.Pan] = new PanControl(renderManager);
	this.controls[ControlMode.Pick] = new PickControl(renderManager);
	this.controls[ControlMode.Measure] = new MeasureControl(renderManager);		
	
	this.currentControl = null;
	this.previousControl = null;
	
	this.dispose = function() {
		this.domElement.removeEventListener( 'pointerdown', onPointerDown, false );
		this.domElement.removeEventListener( 'pointermove', onPointerMove, false );
		this.domElement.removeEventListener( 'pointerup', onPointerUp, false );		
		this.domElement.removeEventListener( 'wheel', onMouseWheel, false );				
		this.domElement.removeEventListener( 'contextmenu', onContextMenu, false );
        this.domElement.removeEventListener( 'dblclick', onDblClick, false );
		window.removeEventListener( 'keydown', onKeyDown, false );		
		window.removeEventListener( 'keyup', onKeyUp, false );		        
	}

	this.getCurrentControlMode = function() {
		return scope.currentControl?.Mode;
	}
	
	this.setControlMode = function(mode) {
		// 기존 컨트롤 동작을 초기화한다.
		if(scope.currentControl != null) {
			scope.currentControl.reset();
		}

		// 현재 컨트롤 모드를 저장한다.
		scope.previousControl = scope.currentControl;

		// 새로운 컨트롤 모드를 설정한다.
		scope.currentControl = scope.controls[mode];
		scope.currentControl.onModeEntered();

		scope.renderManager.$eventBus.$emit("control-mode-changed", mode);
	}

	this.restoreControlMode = function() {
		// 무조건 기본 모드로 되돌린다.
		scope.setControlMode(ControlMode.Rotation);
	}

	this.setControlModeWithoutReset = function(mode, initialData) {
				
		// 현재 컨트롤 모드를 저장한다.
		scope.previousControl = scope.currentControl;

		// 새로운 컨트롤 모드를 설정한다.
		scope.currentControl = scope.controls[mode];

        scope.currentControl.setInitialData(initialData);

		scope.renderManager.$eventBus.$emit("control-mode-changed", mode);
	}

	this.render = function(renderer) {
		if(this.currentControl != null) {
			this.currentControl.render(renderer); 
		}		
	}			

	//
	// event handlers - FSM: listen for events and reset state
	//
	function onPointerDown( event ) {
		/* 0: LEFT */
		/* 1: MIDDLE */
		/* 2: RIGHT */
		switch ( event.pointerType ) {
			case 'mouse':
			case 'pen':

				// Prevent the browser from scrolling.
				event.preventDefault();

				// Manually set the focus since calling preventDefault above
				// prevents the browser from setting it automatically.
				scope.domElement.focus ? scope.domElement.focus() : window.focus();

				if (event.button == 2 /* RIGHT */) {					
					scope.setControlModeWithoutReset(ControlMode.Pan);
				}

				let rect = scope.domElement.getBoundingClientRect();
				if(scope.currentControl != null) {
					scope.currentControl.handleMouseDown ( {clientX:event.clientX-rect.left, clientY:event.clientY-rect.top, button:event.button} );
				}
				break;
		}
	}

	function onPointerMove( event ) {
		switch ( event.pointerType ) {
			case 'mouse':
			case 'pen':
				event.preventDefault();
				let rect = scope.domElement.getBoundingClientRect();
				if(scope.currentControl != null) {
					scope.currentControl.handleMouseMove( {clientX:event.clientX-rect.left, clientY:event.clientY-rect.top, button:event.button} );
				}
				break;
		}
	}

	function onPointerUp( event ) {
		switch ( event.pointerType ) {
			case 'mouse':
			case 'pen':				
				let rect = scope.domElement.getBoundingClientRect();
				if(scope.currentControl != null) {
					scope.currentControl.handleMouseUp( {clientX:event.clientX-rect.left, clientY:event.clientY-rect.top, button:event.button} );
				}

				if (event.button == 2 /* RIGHT */) {
				 	if(scope.previousControl != null) {			
				 		scope.setControlModeWithoutReset(scope.previousControl.Mode);
				 	}
				}

				break;
		}

	}

	function onMouseWheel ( event ) {

		event.preventDefault();
		event.stopPropagation();
		let rect = scope.domElement.getBoundingClientRect();

		scope.controls[ControlMode.Zoom].handleMouseWheel( {clientX:event.clientX-rect.left, clientY:event.clientY-rect.top, button:event.button, deltaY:event.deltaY} );
	}

	function onKeyDown( event ) {

		if(scope.currentControl != null) {
			scope.currentControl.handleKeyDown( event );
		}
	}	

	function onKeyUp( event ) {

		if(scope.currentControl != null) {
			scope.currentControl.handleKeyUp( event );
		}
	}	

	function onContextMenu(event) {
		event.preventDefault();
	}

    function onDblClick(event) {
        //console.log(event);
        if(scope.currentControl != null) {
            let rect = scope.domElement.getBoundingClientRect();
			scope.currentControl.handleDoubleClick({clientX:event.clientX-rect.left, clientY:event.clientY-rect.top, button:event.button});
		}
    }

	this.domElement.addEventListener( 'pointerdown', onPointerDown, false );	
	this.domElement.addEventListener( 'pointermove', onPointerMove, false );	
	this.domElement.addEventListener( 'pointerup', onPointerUp, false );	
	this.domElement.addEventListener( 'wheel', onMouseWheel, false );
	this.domElement.addEventListener( 'contextmenu', onContextMenu, false );
    this.domElement.addEventListener( 'dblclick', onDblClick, false );
	window.addEventListener( 'keydown', onKeyDown, false);
	window.addEventListener( 'keyup', onKeyUp, false);
};

ControlManager.prototype = Object.create( EventDispatcher.prototype );
ControlManager.prototype.constructor = ControlManager;

export { ControlManager };
