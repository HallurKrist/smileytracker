

export function Rect(descr) {
    for (var property in descr) {
        this[property] = descr[property];
    }
}

Rect.prototype.cx = 100;
Rect.prototype.cy = 100;
Rect.prototype.width = 20;
Rect.prototype.height = 20;

Rect.prototype.scale = 1;
Rect.prototype.rotation = 0;
