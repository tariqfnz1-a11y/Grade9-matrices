import assert from 'node:assert/strict';
import {
  addMatrices,
  classifyMatrix,
  compute2x2Inverse,
  matricesEqual,
  multiplyMatrices,
  solve2x2System,
  transposeMatrix,
  verifySystemSubstitution,
} from './matrixMath';

// 1. Matrix Builder & Classifier Tests
const rowMat = [[2, -1, 5, 0]];
const rowClass = classifyMatrix(rowMat);
assert.equal(rowClass.orderLabel, '1-by-4');
assert.equal(rowClass.isRow, true);
assert.equal(rowClass.isRectangular, true);

const colMat = [[4], [-2], [7]];
const colClass = classifyMatrix(colMat);
assert.equal(colClass.orderLabel, '3-by-1');
assert.equal(colClass.isColumn, true);
assert.equal(colClass.isRectangular, true);

const identityMat = [
  [1, 0],
  [0, 1],
];
const idClass = classifyMatrix(identityMat);
assert.equal(idClass.orderLabel, '2-by-2');
assert.equal(idClass.isSquare, true);
assert.equal(idClass.isIdentity, true);
assert.equal(idClass.isScalar, true);
assert.equal(idClass.isDiagonal, true);

// 2. Transpose Tests
const orig = [
  [1, 2, 3],
  [4, 5, 6],
];
const trans = transposeMatrix(orig);
assert.equal(
  matricesEqual(trans, [
    [1, 4],
    [2, 5],
    [3, 6],
  ]),
  true
);
assert.equal(matricesEqual(transposeMatrix(trans), orig), true);

// 3. Addition & Subtraction Tests
const A = [
  [2, -1],
  [4, 3],
];
const B = [
  [1, 5],
  [-2, 2],
];
assert.equal(
  matricesEqual(addMatrices(A, B, false)!, [
    [3, 4],
    [2, 5],
  ]),
  true
);
assert.equal(
  matricesEqual(addMatrices(A, B, true)!, [
    [1, -6],
    [6, 1],
  ]),
  true
);

// 4. Matrix Multiplication Tests (Exercise 1.4 known product)
const mA = [
  [1, 2, 0],
  [-1, 3, 2],
];
const mB = [
  [2, -1],
  [1, 4],
  [0, 3],
];
const mProd = multiplyMatrices(mA, mB)!;
assert.equal(
  matricesEqual(mProd, [
    [4, 7],
    [1, 19],
  ]),
  true
);

// 5. Determinant & Singularity Tests
const singular = [
  [2, 6],
  [1, 3],
];
const singRes = compute2x2Inverse(singular);
assert.equal(singRes.determinant, 0);
assert.equal(singRes.isSingular, true);
assert.equal(singRes.inverseNumeric, null);

// 6. Inverse Matrix Tests (A * A^-1 = I2)
const invertible = [
  [3, 1],
  [1, 2],
];
const invRes = compute2x2Inverse(invertible);
assert.equal(invRes.determinant, 5);
assert.equal(invRes.isSingular, false);
assert.equal(
  matricesEqual(invRes.adjoint, [
    [2, -1],
    [-1, 3],
  ]),
  true
);
const productIdentity = multiplyMatrices(invertible, invRes.inverseNumeric!)!;
assert.equal(matricesEqual(productIdentity, identityMat), true);

// 7. Cramer's Rule & Substitution Verification Tests (Exercise 1.6 Q1: 2x-2y=4, 3x+2y=6 -> x=2, y=0)
const sys1 = solve2x2System(2, -2, 4, 3, 2, 6);
assert.equal(sys1.detA, 10);
assert.equal(sys1.detAx, 20);
assert.equal(sys1.detAy, 0);
assert.equal(sys1.x, 2);
assert.equal(sys1.y, 0);
const check1 = verifySystemSubstitution(2, -2, 4, 3, 2, 6, sys1.x!, sys1.y!);
assert.equal(check1.eq1Verified, true);
assert.equal(check1.eq2Verified, true);

// Exercise 1.6 Q1(iv): 3x-2y=-6, 5x-2y=-10 -> x=-2, y=0
const sys2 = solve2x2System(3, -2, -6, 5, -2, -10);
assert.equal(sys2.detA, 4);
assert.equal(sys2.detAx, -8);
assert.equal(sys2.detAy, 0);
assert.equal(sys2.x, -2);
assert.equal(sys2.y, 0);
const check2 = verifySystemSubstitution(3, -2, -6, 5, -2, -10, sys2.x!, sys2.y!);
assert.equal(check2.eq1Verified, true);
assert.equal(check2.eq2Verified, true);

console.log('ALL MATRIX MATH UNIT TESTS PASSED');
