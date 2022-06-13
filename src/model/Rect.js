
export class Rect {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    get minx() { return this.x; }
    get miny() { return this.y; }
    get maxx() { return this.x + this.w; }
    get maxy() { return this.y + this.h; }
    get dx() { return this.w; }
    get dy() { return this.h; }
    get cx() { return (this.minx + this.maxx)/2; }
    get cy() { return (this.miny + this.maxy)/2; }
    get radius() { return Math.sqrt(this.dx*this.dx + this.dy*this.dy); }

    setAspect(aspect) {
        let cy = this.cy;
        let dx = this.dx;
        this.h = dx * aspect;
        this.y = cy - this.h / 2;
        return this;
    }

    get aspect() { return this.h / this.w; }

    set(x, y, w, h) {
        this.x = x;
        this.y = y;              
        this.w = w;
        this.h = h;
        return this;
    }

    copyFrom(rect) {
        this.x = rect.x;
        this.y = rect.y;              
        this.w = rect.w;
        this.h = rect.h;
        return this;
    }

    clone() {
        return new Rect(this.x, this.y, this.w, this.h);
    }

    expand(xoffset, yoffset) {
        return new Rect(this.x - xoffset, this.y - yoffset, this.w + xoffset*2, this.h + yoffset * 2);
    }

    contains(pt) {
        return pt.x >= this.minx && pt.x <= this.maxx && pt.y >= this.miny && pt.y <= this.maxy;
    }

    setBox(p) {
        this.x = p.x;
        this.y = p.y;
        this.w = 0;
        this.h = 0;
        return this;
    }

    updateBox(p) {
        let c = this.clone();

        if(p.x < c.minx) {            
            this.x = p.x;
            this.w = c.w + Math.abs(c.minx - p.x);
        }
        else if(p.x > c.maxx) {
            this.w = c.w + Math.abs(c.maxx - p.x);
        }

        if(p.y < c.miny) {
            this.y = p.y;
            this.h = c.h + Math.abs(c.miny - p.y);
        }
        else if(p.y > c.maxy) {
            this.h = c.h + Math.abs(c.maxy - p.y);
        }
        return this;
    }
}