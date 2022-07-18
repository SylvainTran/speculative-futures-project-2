
export class CircularQueue<T> {

    storage: T[]; 
    len: number;
    size: number;
    front: number;
    rear: number;

    constructor(size: number) {
        this.size = size;
        this.storage = new Array(size);
        this.len = 0;
        this.front = -1;
        this.rear = 0;
    }

    public enqueue(el: T) {
        if (this.len >= this.size) {
            console.log("Max queue capacity reached. Cannot enqueue further.");
            return;
        }
        this.storage[this.rear % this.size] = el;
        this.rear++;
        this.len++;
    }

    public dequeue(): T | null {
        if (this.isEmpty()) {
            console.log("Empty queue");
            return null;
        }
        this.front++;
        this.len--;
        return this.storage[this.front % this.size];
    }

    public isEmpty(): boolean {
        return this.len === 0;
    }

    public getFront(): T | null {
        if (this.isEmpty()) {
            console.log("Empty queue!");
            return null;
        }
        return this.storage[this.front];
    }

    public clear(): void {
        this.storage = [];
        this.len = 0
        this.rear = 0
        this.front = -1
    }
}
