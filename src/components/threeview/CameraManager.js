
import * as THREE from 'three/build/three.module';
import { Rect } from '../../model/Rect.js';
import { CameraUtil } from './CameraUtil.js'

export class CameraManager {
    constructor(initialWorldSpace) {   
        // 뷰포트를 정의한다. 뷰포트는 캔버스의 픽셀 크기이다.
        this.viewport = initialWorldSpace;
        // 직교투영 카메라를 생성한다.
        this.camera = new THREE.OrthographicCamera();
        this.focalPosition = new THREE.Vector3(0, 0, 0);
        this.updateWorldRect(initialWorldSpace);

        this.canvasCamera = new THREE.OrthographicCamera();
        this.canvasViewport = initialWorldSpace.clone();
    }

    updateWorldRect(worldRect, resetViewOffset = false)
    {
        if(resetViewOffset == true) {
            this.camera.setViewOffset(1, 1, 0, 0, 1, 1);            
        }
        
        // 직교투영 카메라를 투영 영역을 설정한다. 직교 투영 카메라의 초기 투영 영역은 지도의 가로가 화면에 꽉차도록 설정한다. 이럴 경우 보통 모니터 화면이 가로로 길기 때문에 세로 영역의 양끝쪽이 잘리게 된다.
        // 만약 세로 영역을 기준으로 하면 (지도가 정방형일 때) 전체 지도가 화면에 표시되는 대신 양쪽이 까맣게(clear 색) 표시된다.
        // left, right, top, bottom: 카메라 중심에서 left 방향의 signed 거리. top이 +Y 방향인 점에 주의.
        // 직교투영이기 때문에 카메라의 near와 far 거리값은 큰 의미는 없으나, 원근 투영 카메라로 교체했을 때도 clpping이 발생하지 않도록 충분히 큰 값으로 잡는다. near:0.001미터, far:월드 크기의 3배           
        let scenebox = worldRect.clone().setAspect(this.viewport.aspect);

        this.camera.left = scenebox.dx / -2;
        this.camera.right = scenebox.dx / 2;
        this.camera.top = scenebox.dy / 2;
        this.camera.bottom = scenebox.dy / -2;
        this.camera.near = 0.001;
        this.camera.far = scenebox.radius * 3;
        this.camera.zoom = 1;
        this.camera.updateProjectionMatrix();        

        // 카메라의 위치는 +z 영역이면 아무 곳이나 상관없으나, 원근 투영 카메라로 바꿨을 때를 대비해 월드 중심 기준으로 월드 크기만큼 떨어진 곳에 잡는다. 월드의 크기는 맵 전체를 감싸는 AABB의 대각선 길이이다.
        this.camera.position.set(scenebox.cx, scenebox.cy, scenebox.radius);            
        
        // 카메라의 방향은 월드의 중심을 -z 방향으로 바라보게끔 설정한다.
        this.camera.lookAt(scenebox.cx, scenebox.cy, -1.0);

        // 카메라가 응시하는 포인트를 월드의 중심으로 설정한다.
        this.focalPosition = new THREE.Vector3(scenebox.cx, scenebox.cy, 0);
        //this.robotPose = new Pose();
    }

    updateViewport(container) {

        this.updateWorldCamera(container);
        this.updateCanvasCamera(container);
    }

    updateWorldCamera(container) {
        // 방법 1
        // // 뷰포트 갱신
        // this.viewport.set(0, 0, container.clientWidth, container.clientHeight);
        // // 뷰 프러스텀의 비율 변경        
        // this.camera.aspect = this.viewport.aspect;
        // this.camera.updateProjectionMatrix();

        // 방법1의 경우 화면 크기가 변경되면 화면이 찌그러지게 된다.
        // 따라서 화면의 크기가 변경되면 왼쪽 하단을 기준으로 기존의 화면이 잘리도록 프로젝션을 변경하기로 한다.
        // TODO: 화면 크기 변경 후의 뷰 프러스텀 정의
        
        // 기존 프로젝션 크기
        let prevProjectionSize = {x: this.camera.right - this.camera.left, y: this.camera.top - this.camera.bottom };

        // 현재 화면의 픽셀당 거리값
        let distPerPixel = (this.camera.right - this.camera.left) / this.viewport.dx;

        // 뷰포트 갱신
        this.viewport.set(0, 0, container.clientWidth, container.clientHeight);

        // 프로젝션 크기 변경
        let projectionWidth =  this.viewport.dx * distPerPixel;
        let aspect = this.viewport.aspect;
        this.camera.left = projectionWidth / -2;
        this.camera.right = projectionWidth / 2;
        this.camera.top = projectionWidth * aspect / 2;
        this.camera.bottom = projectionWidth * aspect / -2;
        this.camera.updateProjectionMatrix();

        let newProjectionSize = {x: this.camera.right - this.camera.left, y: this.camera.top - this.camera.bottom };

        // 기존 화면의 중심이 늘어난(혹은 줄어든) 화면에서도 중심이 되도록 카메라 위치를 조정한다.
        let right = new THREE.Vector3();
        let up = new THREE.Vector3();
        let toward = new THREE.Vector3();
        this.camera.matrix.extractBasis(right, up, toward);
        this.camera.position.addScaledVector(right, (newProjectionSize.x - prevProjectionSize.x) / 2);
        this.camera.position.addScaledVector(up, (newProjectionSize.y - prevProjectionSize.y) / 2);
        this.camera.updateMatrix();        
    } 

    updateCanvasCamera(container) {  
        
        // 뷰포트 갱신
        this.canvasViewport.set(0, 0, container.clientWidth, container.clientHeight);

        // 프로젝션 크기 변경
        let aspect = this.viewport.aspect;
        this.canvasCamera.left = this.canvasViewport.dx / -2;
        this.canvasCamera.right = this.canvasViewport.dx / 2;
        this.canvasCamera.top = this.canvasViewport.dy / 2;
        this.canvasCamera.bottom = this.canvasViewport.dy / -2;
        this.canvasCamera.near = 0.001;
        this.canvasCamera.far = this.canvasViewport.radius * 3;
        this.canvasCamera.updateProjectionMatrix();
        this.canvasCamera.position.set(this.canvasViewport.cx, this.canvasViewport.cy, this.canvasViewport.radius);
        this.canvasCamera.lookAt(this.canvasViewport.cx, this.canvasViewport.cy, -1.0);
        this.canvasCamera.updateMatrix();
    }
    
    zoomIn() {
        CameraUtil.zoom(this.camera, 1.1, new THREE.Vector2(this.viewport.cx, this.viewport.cy), this.viewport);
    }

    zoomOut() {
        CameraUtil.zoom(this.camera, 0.9, new THREE.Vector2(this.viewport.cx, this.viewport.cy), this.viewport);
    }  

    rotate(degree) {
        CameraUtil.rotate(this.camera, this.focalPosition, degree);
    }
}