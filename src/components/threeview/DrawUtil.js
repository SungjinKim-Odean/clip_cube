
import * as THREE from 'three/build/three.module'

export class DrawUtil {

    static ScalarToColor(val, minval, maxval)
    {
        let normval = 0;
        if(maxval == minval)
            normval = 1;
        else
        {
            normval = (val-minval ) / (maxval-minval);
            if(normval > 1)
                normval = 1;
            else if(normval < 0)
                normval = 0;
        }

        return DrawUtil.NormalValueToColor(normval);
    }

    static NormalValueToColor(normval)
    {
        let s = 1.0;
        let v = 1.0;
        let h = normval * 0.65;

        h = 6 * h;
        let k = Math.floor(h);
        let k0 = (k==0 || k==6) ? 1 : 0; 
        let k1 = (k==1) ? 1 : 0; 
        let k2 = (k==2) ? 1 : 0;
        let k3 = (k==3) ? 1 : 0; 
        let k4 = (k==4) ? 1 : 0; 
        let k5 = (k==5) ? 1 : 0;

        let p = h - k;
        let t = 1 - s;
        let n = 1 - s * p;
        p = 1- ( s * (1 - p));
        let r = k0     + k1 * n + k2 * t + k3 * t + k4 * p + k5;
        let g = k0 * p + k1     + k2     + k3 * n + k4 * t + k5 * t;
        let b = k0 * t + k1 * t + k2 * p + k3     + k4     + k5 * n;

        return new THREE.Color(r*v, g*v, b*v);
    }


    static createOverlayGeometry(name, vertexCount) {
        const geometry = new THREE.Geometry();
        for(let i=0; i<vertexCount; i++) {
            geometry.vertices.push(new THREE.Vector3(0,0,0));
        }
        let sceneNode = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial( { vertexColors: true, side: THREE.DoubleSide } ));
        sceneNode.name = name;
        return sceneNode;  
    }    

    static createPointsNode(name, vertexCount, pointSize, color) {
        const geometry = new THREE.BufferGeometry()
            .setAttribute('position', new THREE.Float32BufferAttribute(vertexCount * 3, 3));            
        geometry.setDrawRange(0, 0);
        const material = new THREE.PointsMaterial( { color:color, size:pointSize} );        
        let sceneNode = new THREE.Points(geometry, material);
        sceneNode.name = name;
        return sceneNode;
    }

    static createColoredPointsNode(name, vertexCount, pointSize, color) {
        const geometry = new THREE.BufferGeometry()
            .setAttribute('position', new THREE.Float32BufferAttribute(vertexCount * 3, 3))
            .setAttribute('color', new THREE.Float32BufferAttribute(vertexCount * 3, 3 ));
        geometry.setDrawRange(0, 0);
        const material = new THREE.PointsMaterial( { vertexColors:true, color:color, size:pointSize} );        
        let sceneNode = new THREE.Points(geometry, material);
        sceneNode.name = name;
        return sceneNode;
    }

    static updateVertices(sceneNode, points)
    {
        const positions = sceneNode.geometry.getAttribute("position");
		const pointCount = Math.min(points.length, positions.count);		
        for(let i=0; i < pointCount; i++) {
            positions.array[i * 3 + 0] = points[i].x;
            positions.array[i * 3 + 1] = points[i].y;
			positions.array[i * 3 + 2] = points[i].z;
        }        
        positions.needsUpdate = true; // 플래그 업데이트
        sceneNode.geometry.setDrawRange(0, pointCount); // 가시화 포인트 수 변경  (non-indexed BufferGeometry only)
        sceneNode.geometry.computeBoundingSphere();
    }

    static updateMeshVertices(sceneNode, points)
    {
        const positions = sceneNode.geometry.getAttribute("position");
		const pointCount = Math.min(points.length, positions.count);		
        for(let i=0; i < pointCount; i++) {
            positions.array[i * 3 + 0] = points[i].x;
            positions.array[i * 3 + 1] = points[i].y;
			positions.array[i * 3 + 2] = points[i].z;
        }        
        positions.needsUpdate = true; // 플래그 업데이트        
        sceneNode.geometry.computeBoundingSphere();
    }

    static createPointCurveNode(name, vertexCount, color) {
        const geometry = new THREE.BufferGeometry()
            .setAttribute('position', new THREE.Float32BufferAttribute(vertexCount * 3, 3));
        geometry.setDrawRange(0, 0);
        const material = new THREE.LineBasicMaterial( { color:color} );
        material.depthTest = false;
        let sceneNode = new THREE.Line(geometry, material);
        sceneNode.name = name;
        return sceneNode;
    }

    static createDashedCurveNode(name, vertexCount, color, lineWidth, dashSize, gapSize) {
        const geometry = new THREE.BufferGeometry()
            .setAttribute('position', new THREE.Float32BufferAttribute(vertexCount * 3, 3));
        geometry.setDrawRange(0, 0);
        const material = new THREE.LineDashedMaterial( { color:color, dashSize:dashSize, gapSize:gapSize} );
        material.depthTest = false;
        let sceneNode = new THREE.Line(geometry, material);
        sceneNode.name = name;
        return sceneNode;
    }    

    static createCanvasNode(name, canvasTexture) {
        const geometry = new THREE.BufferGeometry()
            .setAttribute('position', new THREE.Float32BufferAttribute(4*3, 3))
            .setAttribute('uv', new THREE.Float32BufferAttribute(new Float32Array([0,0,1,0,1,1,0,1]), 2))
            .setIndex([0,1,2,0,2,3]);
        const material = new THREE.MeshBasicMaterial( { map: canvasTexture, transparent: true } );
        material.depthTest = false;
        let sceneNode = new THREE.Mesh(geometry, material);
        sceneNode.name = name;
        return sceneNode;
    }    

    static updateCanvasRect(sceneNode, rect) {             
        let points = [
            new THREE.Vector3(rect.minx, rect.miny,  0.0),
            new THREE.Vector3(rect.maxx, rect.miny,  0.0),
            new THREE.Vector3(rect.maxx, rect.maxy,  0.0),
            new THREE.Vector3(rect.minx, rect.maxy,  0.0)
        ];
                
        const positions = sceneNode.geometry.getAttribute("position");
		const pointCount = Math.min(points.length, positions.count);		
        for(let i=0; i < pointCount; i++) {
            positions.array[i * 3 + 0] = points[i].x;
            positions.array[i * 3 + 1] = points[i].y;
			positions.array[i * 3 + 2] = points[i].z;
        }        
        positions.needsUpdate = true; // 플래그 업데이트
        sceneNode.geometry.computeBoundingSphere();
    }

    static createPolygonNode(name, vertices, color) {             
        const verticesArray = [];
        for(let i=0; i<vertices.length; i++) {
            verticesArray.push(vertices[i].x);
            verticesArray.push(vertices[i].y);
            verticesArray.push(vertices[i].z);
        }

        const indexArray = [];
        for(let i=0; i<vertices.length-2; i++) {
            indexArray.push(0);
            indexArray.push(i+1);
            indexArray.push(i+2);
        }

        const geometry = new THREE.BufferGeometry()
            .setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(verticesArray), 3))         
            .setIndex(indexArray);
        const material = new THREE.MeshBasicMaterial( { color:color } );        
        let sceneNode = new THREE.Mesh(geometry, material);
        sceneNode.name = name;
        return sceneNode;
    }

    static getCylindricalArrowGeometry(start, end, width) {
        let dist = start.distanceTo(end);            
        if(dist < 0.001)
            return null;

        let cone_length = width * 3;
        let cylinder_length = dist - cone_length;
        // THREE.CylinderGeometry를 통해 생성되는 실린더의 아랫면 중심점:(0, length/-2, 0), 윗면 중심점:(0, length/2, 0)이 되기 때문에 원하는 방향으로 변환해 주어야 한다.
        let cylinder = new THREE.CylinderGeometry(width, width, cylinder_length, 36, 1);
        cylinder.translate(0, cylinder_length/2, 0);

        // THREE.ConeGeometry으로 생성되는 아랫면 중심점:(0, length/-2, 0), 윗면 중심점:(0, length/2, 0)이기 때문에, 원하는 방향으로 변환해 주어야 한다. 
        const cone = new THREE.ConeGeometry(cone_length, cone_length, 36);
        cone.translate(0, cylinder_length + cone_length/2, 0);

        let geometry = new THREE.Geometry();
        geometry.merge(cylinder, cylinder.matrix);
        geometry.merge(cone, cone.matrix);

        let v = new THREE.Vector3().subVectors(end, start).normalize();            
        let rotateAxis = new THREE.Vector3(0, 1, 0).cross(v);  
        if(rotateAxis.length() == 0) {   // Y축에 평행하면, +z축을 회전축으로 한다.
            rotateAxis = new THREE.Vector3(0, 0, 1);
        }
        rotateAxis.normalize();            
        let angle = new THREE.Vector3(0, 1, 0).angleTo(v); // Y축과 화살표 축 간의 각도
        geometry.applyMatrix4(new THREE.Matrix4().makeRotationAxis(rotateAxis, angle));
        geometry.translate(start.x, start.y, start.z);
        return geometry;
        
    }

    static getPrismGeometry(geometry, vertices, bottom, top) {
        let vtxCount = geometry.vertices.length;                        
        for(let i=0; i < vertices.length; i++)
        {
            let j = (i + 1) % vertices.length;

            // 1 - 3
            // | / |
            // |/  |
            // 0 - 2

            geometry.vertices.push(new THREE.Vector3(vertices[i].x, vertices[i].y, bottom));
            geometry.vertices.push(new THREE.Vector3(vertices[i].x, vertices[i].y, top));
            geometry.vertices.push(new THREE.Vector3(vertices[j].x, vertices[j].y, bottom));                
            geometry.vertices.push(new THREE.Vector3(vertices[j].x, vertices[j].y, top));

            geometry.faces.push(new THREE.Face3(vtxCount + 0, vtxCount + 2, vtxCount + 3));
            geometry.faces.push(new THREE.Face3(vtxCount + 0, vtxCount + 3, vtxCount + 1));

            vtxCount += 4;
        }
    }

    static getTristripGeometry(geometry, vertices) {
        let vtxCount = geometry.vertices.length;            
        for(let i=0; i < vertices.length; i++)
        {                
            geometry.vertices.push(vertices[i]);
        }

        for(let i=0; i < vertices.length-2; i++)
        {
            if(i % 2 == 0) {                
                geometry.faces.push(new THREE.Face3(vtxCount + i + 0, vtxCount + i + 1, vtxCount + i + 2));
            }
            else {
                geometry.faces.push(new THREE.Face3(vtxCount + i + 1, vtxCount + i + 0, vtxCount + i + 2));
            }
        }
    }

    static createMeshNode(geometry, color, name = "") {        
        let material = new THREE.MeshBasicMaterial( { color: color, side: THREE.DoubleSide } );
        material.depthTest = false;
        let mesh = new THREE.Mesh( geometry, material );
        mesh.name = name;
        return mesh;
    }

    static drawWireframe(parent, geometry, color) {
        const wireframe = new THREE.WireframeGeometry( geometry );
        const line = new THREE.LineSegments( wireframe );
        line.material.depthTest = false;
        line.material.opacity = 0.25;
        line.material.transparent = true;
        line.material.color = color;            
        parent.add(line);
    }   

    // static createPathNode(center, radius, angle, color) {
    //     let vertices = [];
    //     let colors = [];
    //     let index = [];   
    //     let segment = 36;
    //     let unitRad = Math.PI * 2 / segment;
    //     let vertexCount = 0;

    //     // circle
    //     vertices.push(center.x);
    //     vertices.push(center.y);
    //     vertices.push(center.z);
    //     vertexCount += 1;

    //     for(let i=0; i<=segment; i++) {
    //         let x = radius * Math.cos(unitRad* i);
    //         let y = radius * Math.cos(unitRad* i);
    //         let z = radius * Math.cos(unitRad* i);
    //         vertices.push(center.x);
    //         vertices.push(center.y);
    //         vertices.push(center.z);
    //     }

    //     const geometry = new THREE.BufferGeometry()
    //         .setAttribute('position', new THREE.Float32BufferAttribute(4*3, 3))
    //         .setAttribute('uv', new THREE.Float32BufferAttribute(new Float32Array([0,0,1,0,1,1,0,1]), 2))
    //         .setIndex([0,1,2,0,2,3]);
    //     const material = new THREE.MeshBasicMaterial( { map: canvasTexture, transparent: true } );
    //     material.depthTest = false;
    //     let sceneNode = new THREE.Mesh(geometry, material);
    //     sceneNode.name = name;
    //     return sceneNode;
    // }

    static createDirectionMarkNode(length, width, z, angle, color) {
        const geometry = new THREE.BoxGeometry(length, width, 0).translate(length/2, 0, z).rotateZ(THREE.MathUtils.degToRad(angle));
        geometry.computeBoundingSphere();
        return this.createMeshNode(geometry, color);
    }      

    static createCylinderNode(radius, z, color) {
        const geometry = new THREE.CylinderGeometry(radius, radius, 0, 36).rotateX(Math.PI/2).translate(0, 0, z);        
        geometry.computeBoundingSphere();
        return this.createMeshNode(geometry, color);
    }

    static createRingNode(innerRadius, outerRadius, z, color) {    
        let segment = 36; 
        let unitRad = Math.PI * 2 / segment;

        // bottom
        const bottomFaceStrip = [];
        for(let i=0; i < segment; i++) {
            bottomFaceStrip.push(new THREE.Vector3(innerRadius * Math.cos((i + 0) * unitRad), innerRadius * Math.sin((i + 0) * unitRad), z));
            bottomFaceStrip.push(new THREE.Vector3(outerRadius * Math.cos((i + 0) * unitRad), outerRadius * Math.sin((i + 0) * unitRad), z));
            bottomFaceStrip.push(new THREE.Vector3(innerRadius * Math.cos((i + 1) * unitRad), innerRadius * Math.sin((i + 1) * unitRad), z));
            bottomFaceStrip.push(new THREE.Vector3(outerRadius * Math.cos((i + 1) * unitRad), outerRadius * Math.sin((i + 1) * unitRad), z));
        }

        const geometry = new THREE.Geometry();
        this.getTristripGeometry(geometry, bottomFaceStrip);        
        geometry.computeFaceNormals();
        geometry.computeVertexNormals();

        return this.createMeshNode(geometry, color);
    }

    
    static createLineNode(points, color, lineWidth) {   
        const geometry = new THREE.Geometry();
        points.forEach(p => {
            geometry.vertices.push(p.clone());
        });

        const material = new THREE.LineBasicMaterial( { linewidth: lineWidth, color:color } );
        let line = new THREE.Line( geometry, material);        
        return line;
    }
    
    static createArrowNode(start, end, width, z, color) {
        let dist = start.distanceTo(end);            
        if(dist < 0.1)
            return null;
        
        const geometry = new THREE.Geometry();
        let v = new THREE.Vector2().subVectors(end, start).normalize();
        let perp = new THREE.Vector2(-v.y, v.x);

        let s = start;
        let e = end.clone().addScaledVector(v, -width*3);

        let vertices = [];            
        vertices.push(s.clone().addScaledVector(perp, -width)); // start - perp * w
        vertices.push(e.clone().addScaledVector(perp, -width));  // end - perp * 3w
        vertices.push(e.clone().addScaledVector(perp, -width * 2));  // end - perp * 2w
        vertices.push(e.clone().addScaledVector(v, width * 3)); // end + v * 2w
        vertices.push(e.clone().addScaledVector(perp, width * 2)); // end + perp * 2w
        vertices.push(e.clone().addScaledVector(perp, width)); // end + per * w
        vertices.push(s.clone().addScaledVector(perp, width)); // start + pert * w            

        //bottom face
        let vtxCount = geometry.vertices.length;
        for(let i=0; i < vertices.length; i++) {
            geometry.vertices.push(new THREE.Vector3(vertices[i].x, vertices[i].y, z));
        }
        geometry.faces.push(new THREE.Face3(vtxCount + 0, vtxCount + 1, vtxCount + 6));
        geometry.faces.push(new THREE.Face3(vtxCount + 1, vtxCount + 5, vtxCount + 6));
        geometry.faces.push(new THREE.Face3(vtxCount + 1, vtxCount + 2, vtxCount + 3));
        geometry.faces.push(new THREE.Face3(vtxCount + 1, vtxCount + 3, vtxCount + 5));
        geometry.faces.push(new THREE.Face3(vtxCount + 5, vtxCount + 3, vtxCount + 4));  

        return DrawUtil.createMeshNode(geometry, color)
    }

    static createThickCurve(vertices, color, thickness) {
        if(vertices.length < 2) {
            return null;
        }

        const geometry = new THREE.Geometry();
        let vtxCount = 0;
        for(let i=0; i<vertices.length-1; i++) {
            let s = vertices[i];
            let e = vertices[i + 1];

            let v = new THREE.Vector3().subVectors(e, s).normalize();
            let perp = new THREE.Vector3(-v.y, v.x, 0);

            // s1 --------------------------------- e1
            //  s                                   e
            // s2 ----------------------------------e2

            let s1 = s.clone().addScaledVector(perp, thickness);
            let s2 = s.clone().addScaledVector(perp, -thickness);
            let e1 = e.clone().addScaledVector(perp, thickness);
            let e2 = e.clone().addScaledVector(perp, -thickness);

            geometry.vertices.push(s1);
            geometry.vertices.push(s2);
            geometry.vertices.push(e2);
            geometry.vertices.push(e1);

            geometry.faces.push(new THREE.Face3(vtxCount + 0, vtxCount + 1, vtxCount + 2));
            geometry.faces.push(new THREE.Face3(vtxCount + 0, vtxCount + 2, vtxCount + 3));

            vtxCount += 4;
        }
        
        return DrawUtil.createMeshNode(geometry, color)
    }

    // static createSmoothThickCurve0(vertices, color, thickness) {
    //     if(vertices.length < 2) {
    //         return null;
    //     }
                
    //     let perps = [];
    //     for(let i=0; i<vertices.length-1; i++) {
    //         let v = new THREE.Vector3().subVectors(vertices[i+1], vertices[i]).normalize();
    //         let perp = new THREE.Vector3(-v.y, v.x, 0).multiplyScalar(thickness);
    //         perps.push(perp);

    //         if(i == vertices.length-2) {
    //             perps.push(perp.clone());
    //         }
    //     }

    //     // 부드럽게 연결하는 점 리스트.
    //     let p1s = [];
    //     let p2s = [];
    //     p1s.push(new THREE.Vector3().addVectors(vertices[0], perps[0]));
    //     p2s.push(new THREE.Vector3().subVectors(vertices[0], perps[0]));

    //     for(let i=1; i<perps.length-1; i++) {
    //         let smoothPerp = new THREE.Vector3().addVectors(perps[i], perps[i-1]).multiplyScalar(0.5);
    //         p1s.push(new THREE.Vector3().addVectors(vertices[i], smoothPerp));
    //         p2s.push(new THREE.Vector3().subVectors(vertices[i], smoothPerp));
    //     }        
    //     p1s.push(new THREE.Vector3().addVectors(vertices[vertices.length-1], perps[vertices.length-1]));
    //     p2s.push(new THREE.Vector3().subVectors(vertices[vertices.length-1], perps[vertices.length-1]));
        
    //     // geometry 생성
    //     const geometry = new THREE.Geometry();  
    //     let vtxCount = 0;       
    //     for(let i=0; i<p1s.length-1; i++) {
    //         geometry.vertices.push(p1s[i]);
    //         geometry.vertices.push(p2s[i]);
    //         geometry.vertices.push(p2s[i+1]);
    //         geometry.vertices.push(p1s[i+1]);            
    //         geometry.faces.push(new THREE.Face3(vtxCount + 0, vtxCount + 1, vtxCount + 2));
    //         geometry.faces.push(new THREE.Face3(vtxCount + 0, vtxCount + 2, vtxCount + 3));

    //         vtxCount += 4;
    //     }
        
    //     return DrawUtil.createMeshNode(geometry, color)
    // }

    static intersectionOfLines(s1, e1, s2, e2) {        
        let x1 = s1.x;
        let y1 = s1.y;
        let x2 = e1.x;
        let y2 = e1.y;
        let x3 = s2.x;
        let y3 = s2.y;
        let x4 = e2.x;
        let y4 = e2.y;

        let d = (x1-x2)*(y3-y4)-(y1-y2)*(x3-x4);
        if(Math.abs(d) < 1e-4) {
            return e1.clone();
        }
        let t = ((x1-x3)*(y3-y4) - (y1-y3)*(x3-x4)) / d;
        return new THREE.Vector3(x1+t*(x2-x1),y1+t*(y2-y1));
    }

    static createSmoothThickCurve(vertices, color, thickness) {
        if(vertices.length < 2) {
            return null;
        }
                
        // 각 점의 법선 벡터
        let perps = [];
        for(let i=0; i<vertices.length-1; i++) {
            let v = new THREE.Vector3().subVectors(vertices[i+1], vertices[i]).normalize();
            let perp = new THREE.Vector3(-v.y, v.x, 0).multiplyScalar(thickness);
            perps.push(perp);

            if(i == vertices.length-2) {
                perps.push(perp.clone());
            }
        }

        // 부드럽게 연결하는 점 리스트.
        let p1s = [];
        let p2s = [];
        // 시작점
        p1s.push(new THREE.Vector3().addVectors(vertices[0], perps[0]));
        p2s.push(new THREE.Vector3().subVectors(vertices[0], perps[0]));

        for(let i=1; i<perps.length-1; i++) {            
            
            
            //                                          u4   
            //                                          / v[i+1]
            //                                         /      / d4
            // u1                                   u2/      /
            // --------------------------------------/      /
            //                                      /      /
            //                                     /      /                                            
            // v[i-1]                          u3 / v[i] /
            //                                          /d3                                            
            //                                                                         
            // ---------------------------------------
            // d1                                   d2  
            let u1 = new THREE.Vector3().addVectors(vertices[i-1], perps[i-1]);
            let d1 = new THREE.Vector3().subVectors(vertices[i-1], perps[i-1]);
            let u2 = new THREE.Vector3().addVectors(vertices[i], perps[i-1]);
            let d2 = new THREE.Vector3().subVectors(vertices[i], perps[i-1]);

            let u3 = new THREE.Vector3().addVectors(vertices[i], perps[i]);
            let d3 = new THREE.Vector3().subVectors(vertices[i], perps[i]);
            let u4 = new THREE.Vector3().addVectors(vertices[i+1], perps[i]);
            let d4 = new THREE.Vector3().subVectors(vertices[i+1], perps[i]);

            // 교점
            p1s.push(this.intersectionOfLines(u1, u2, u3, u4));
            p2s.push(this.intersectionOfLines(d1, d2, d3, d4));
        } 
        //끝점       
        p1s.push(new THREE.Vector3().addVectors(vertices[vertices.length-1], perps[vertices.length-1]));
        p2s.push(new THREE.Vector3().subVectors(vertices[vertices.length-1], perps[vertices.length-1]));
        
        // geometry 생성
        const geometry = new THREE.Geometry();  
        let vtxCount = 0;       
        for(let i=0; i<p1s.length-1; i++) {
            geometry.vertices.push(p1s[i]);
            geometry.vertices.push(p2s[i]);
            geometry.vertices.push(p2s[i+1]);
            geometry.vertices.push(p1s[i+1]);            
            geometry.faces.push(new THREE.Face3(vtxCount + 0, vtxCount + 1, vtxCount + 2));
            geometry.faces.push(new THREE.Face3(vtxCount + 0, vtxCount + 2, vtxCount + 3));

            vtxCount += 4;
        }
        
        return DrawUtil.createMeshNode(geometry, color)
    }
}