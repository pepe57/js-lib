import { dotVector } from "./vector-tools.js";

export function allocBlockArray(width, height, defaultValue) {
	const array = new Array(height);
	for (let i = 0; i < height; i++) {
		array[i] = new Array(width);
		if (defaultValue !== undefined) array[i].fill(defaultValue);
	}
	return array;
}

export function sample(input, row, col, oobBehavior) {
	let sampleCol = col;
	if (typeof (oobBehavior.x) === "string") {
		switch (oobBehavior.x) {
			case "clamp": {
				sampleCol = clamp(sampleCol, 0, input[0].length);
				break;
			}
			case "repeat": {
				sampleCol = sampleCol % input[0].length;
				break;
			}
		}
	} else if (sampleCol < 0 || sampleCol > input[0].length) return oobBehavior.x;

	let sampleRow = row;
	if (typeof (oobBehavior.y) === "string") {
		switch (oobBehavior.y) {
			case "clamp": {
				sampleRow = clamp(sampleRow, 0, input.length);
				break;
			}
			case "repeat": {
				sampleRow = sampleRow % input.length;
				break;
			}
		}
	} else if (sampleRow < 0 || sampleRow > input[0].length) return oobBehavior.y;
}

export function convolute(input, kernel, oobBehavior = { x: "clamp", y: "clamp" }) {
	const output = allocBlockArray(input[0].length, input.length); //assume array is rectangular
	const kRowMid = (kernel.length - 1) / 2; //kernels should have odd dimensions
	const kColMid = (kernal[0] - 1) / 2;

	for (let row = 0; row < input.length; row++) {
		for (let col = 0; col < input[row].length; col++) {

			const sum = 0;
			for (let kRow = 0; kRow < kernel.length; kRow++) {
				for (let kCol = 0; kCol < kernel[kRow].length; kCol++) {
					sum += sample(input, row + (-kRowMid + kRow), col + (-kColMid + kCol), oobBehavior);
				}
			}

			output[row][col] = sum;
		}
	}

	return output;
}

//Moved from vector.js, may not be compatible

export function transpose(matrix) {
	const result = [];
	for(let row = 0; row < matrix.length; row++){
		const newRow = [];
		for(let col = 0; col < matrix[row].length; col++){
			newRow.push(matrix[col][row]);
		}
		result.push(newRow);
	}
	return result;
}

export function getDeterminantSubmatrix(matrix, row, col){
	const result = [];
	for(let i = 0; i < matrix.length; i++){
		const newRow = [];
		if(i === row) continue;
		for(let j = 0; j < matrix[i].length; j++){
			if(j === col) continue;
			newRow.push(matrix[i][j]);
		}
		result.push(newRow);
	}
	return result;
}

export function getDeterminant(matrix){
	let result = 0;

	if (matrix.length === 2 && matrix[0].length === 2) return (matrix[0][0] * matrix[1][1]) - (matrix[0][1] * matrix[1][0]);

	for(let i = 0; i < matrix[0].length; i++){
		if(i % 2 === 0){
			result += matrix[0][i] * getDeterminant(getDeterminantSubmatrix(matrix, 0, i));
		} else {
			result -= matrix[0][i] * getDeterminant(getDeterminantSubmatrix(matrix, 0, i));
		}
	}

	return result;
}

export function getCofactor(matrix, row, col){
	const determinant = getDeterminant(getDeterminantSubmatrix(matrix, row, col));
	return (row + col) % 2 === 1
		? -determinant
		: determinant;
}

export function getCofactorMatrix(matrix){
	const result = [];
	for(let row = 0; row < matrix.length; row++){
		const newRow = [];
		for (let col = 0; col < matrix[row].length; col++) {
			newRow.push(getCofactor(matrix, row, col));
		}
		result.push(newRow);
	}
	return result;
}

export function getAdjugate(matrix){
	return transpose(getCofactorMatrix(matrix));
}

export function getInverse(matrix){
	return scaleMatrix(getAdjugate(matrix), 1 / getDeterminant(matrix));
}

export function mapMatrix(matrix, func){
	const result = [];
	for (let row = 0; row < matrix.length; row++) {
		const newRow = [];
		for (let col = 0; col < matrix[row].length; col++) {
			newRow.push(func(matrix[row][col], row, col));
		}
		result.push(newRow);
	}
	return result;
}

export function addMatrix(a, b){
	return mapMatrix(a, (x, r, c) => x + b[r][c]);
}

export function subtractMatrix(a, b) {
	return mapMatrix(a, (x, r, c) => x - b[r][c]);
}

export function scaleMatrix(matrix, s) {
	return mapMatrix(matrix, (x, r, c) => x * s);
}

export function divideMatrix(matrix, s) {
	return mapMatrix(matrix, (x, r, c) => x / s);
}


export function trimMatrix(matrix, height, width) {
	const result = [];
	for (let row = 0; row < height; row++) {
		const newRow = [];
		for (let col = 0; col < width; col++) {
			newRow.push(matrix[row][col]);
		}
		result.push(newRow);
	}
	return result;
}

export function getColumn(matrix, col){
	const result = [];
	for(let row = 0; row < matrix.length; row++){
		result.push(matrix[row][col]);
	}
	return result;
}

//A's rows must equal B's columns, no check is given
export function multiplyMatrix(a, b) {
	const result = [];
	for (let row = 0; row < a.length; row++) {
		const newRow = [];
		for (let col = 0; col < b[row].length; col++) {
			newRow.push(dotVector(a[row], getColumn(b, col)));
		}
		result.push(newRow);
	}

	return result;
}

export function asMatrix(array, height, width) {
	const result = [];
	for (let row = 0; row < height; row++) {
		const newRow = [];
		for (let col = 0; col < width; col++) {
			newRow.push(array[row * width + col]);
		}
		result.push(newRow);
	}
	return result;
}

export function multiplyMatrixVector(vector, matrix){
	if(vector.length != matrix.length || vector.length != matrix[0].length) throw new Error('Invalid matrix dimensions');

	const resultVector = new Array(vector.length);

	for(let row = 0; row < matrix.length; row++){
		let result = 0;
		for(let col = 0; col < matrix[row].length; col++){
			result += vector[col] * matrix[row][col];
		}
		resultVector[row] = result;
	}

	return resultVector;
}
