import {expect} from 'chai';
import {task1, task2} from './index';

describe('task1', () => {
    it('', () => {
        const input = `COM)B
B)C
C)D
D)E
E)F
B)G
G)H
D)I
E)J
J)K
K)L`;
        expect(task1(input)).to.eq(42);
    })
});

describe('task2', () => {
    it('', () => {
        const input = `COM)B
B)C
C)D
D)E
E)F
B)G
G)H
D)I
E)J
J)K
K)L
K)YOU
I)SAN`;
        expect(task2(input)).to.eq(4);
    })
});
