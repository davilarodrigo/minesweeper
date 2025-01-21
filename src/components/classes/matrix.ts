export default class matrix {
    constructor(width: number, height: number) {

    
  
        this.width = width
        this.height = height
  
        this.internal_matrix = new Array(height)
  
        for (let i = 0; i < this.internal_matrix.length; i++) {
            this.internal_matrix[i] = new Array(width)
  
            for (let j = 0; j < this.internal_matrix[i].length; j++) {
                this.internal_matrix[i][j] = 0
            }
        }
    }
  
      internal_matrix: Array<Array<any>>
  
    width: number
    height: number
  
    get_value(x: any, y: any, ignore_out_of_bounds = false): any {
        if (!this.value_is_in_bounds(x, y)) {
            if (ignore_out_of_bounds) {
                return 0
            } else {
                console.log("ignore out of bounds?" + ignore_out_of_bounds)
                console.log("x , y: " + x + " " + y)
  
                throw new Error("values out of matrix bounds")
            }
        }
  
        return this.internal_matrix[y][x]
    }
  
    value_is_in_bounds(x: any, y: any): boolean {
        if (x >= this.width || y >= this.height) {
            return false
        }
        if (x < 0 || y < 0) {
            return false
        }
        return true
    }
  
    set_value(x: any, y: any, value: any) {
        if (!this.value_is_in_bounds(x, y)) {
            throw new Error("setting value out of matrix bounds")
        }
        this.internal_matrix[y][x] = value
    }
  
    set_all_values(value: any) {
        for (let i = 0; i < this.internal_matrix.length; i++) {
            for (let j = 0; j < this.internal_matrix[i].length; j++) {
                this.internal_matrix[i][j] = value
            }
        }
    }
  
    get_all_values(): Array<any> {
        var all_values = new Array<any>()
  
        for (let i = 0; i < this.internal_matrix.length; i++) {
            for (let j = 0; j < this.internal_matrix[i].length; j++) {
                all_values.push(this.internal_matrix[i][j])
            }
        }
  
        return all_values
    }
  
    get_size(): number {
        return this.width * this.height
    }

    get_row(y:number): Array<any>{
        return this.internal_matrix[y]
    }

    get_rows(y:number): Array<Array<any>>{
        return this.internal_matrix
    }
  
    print() {
        for (let i = 0; i < this.internal_matrix.length; i++) {
            const element = this.internal_matrix[i];
            console.log(element)
        }
    }
  }