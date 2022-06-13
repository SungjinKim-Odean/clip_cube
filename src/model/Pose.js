
import { Quaternion } from 'three/build/three.module'
import { Vector3 } from 'three/build/three.module'

export class Pose {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.direction = 0;
    }

    set(x, y, direction) {
        this.x = x;
        this.y = y;
        this.direction = direction;
        return this;
    }

    setPosition(x, y) {
        this.x = x;
        this.y = y;
        return this;
    }     

    clone() {
        return new Pose().set(this.x, this.y, this.direction);
    }

    copy(pose) {
        this.x = pose.x;
        this.y = pose.y;
        this.direction = pose.direction;
        return this;
    }

    setDirectionFromQuaternion(x,y,z,w) {
        let siny_cosp = 2 * (w * z + x * y);
        let cosy_cosp = 1 - 2 * (y * y + z * z);
        let rad = Math.atan2(siny_cosp, cosy_cosp);
        this.direction = rad / Math.PI * 180;

        //this.direction = new Quaternion().setFromAxisAngle(new Vector3(0,0,1), 0).angleTo(new Quaternion(x,y,z,w)) / Math.PI * 180;
        return this;
    }   

    fromPositionOrientation(pose) {
        return this.setPosition(pose.position.x, pose.position.y).setDirectionFromQuaternion(pose.orientation.x, pose.orientation.y, pose.orientation.z, pose.orientation.w);
    }

    toPacket() {
        let q = new Quaternion().setFromAxisAngle(new Vector3(0,0,1), this.direction / 180 * Math.PI);
        return {
            position: {
                x: this.x,
                y: this.y,
                z: 0
            },
            orientation: {
                x: q.x,
                y: q.y,
                z: q.z,
                w: q.w
            }
        }
    }
}