import fs from 'fs';
// eslint-disable-next-line import/extensions
import data from './data.js';

const buildPerson = (startId) => {
  const person = data.filter(({ id }) => id === startId)[0];
  const father = data.reduce((acc, curr) => {
    if (curr.id === person.father) {
      acc.push(curr);
    }
    return acc;
  }, [])[0];
  const mother = data.reduce((acc, curr) => {
    if (curr.id === person.mother) {
      acc.push(curr);
    }
    return acc;
  }, [])[0];
  return {
    ...person,
    parents: [
      father ? buildPerson(father.id) : undefined,
      mother ? buildPerson(mother.id) : undefined
    ]
  };
};

const Name = (person) => (person
  ? `${person.firstname} ${person.middlename ? `${person.middlename.charAt(0)} ` : ''} ${person.lastname} ${person.suffix}`
  : '');
let gen = 0;
const Node = (person) => {
  gen += 1;
  return person ? `
    <g transform="translate(0, ${gen * 30})" >
        <rect width="100%" height="60" stroke="#000" strokeWidth="1" fill="#fff" />
        <text text-anchor="middle" x="50%" y="20">${Name(person)}</text>
        ${person.parents ? person.parents.map((parent, parentIndex) => `
          <text text-anchor="middle" x="${`${(parentIndex + 1) * 33.333}%`}" y="50">${Name(parent)}</text>
          ${parent && parent.parents ? parent.parents.map((grandParent) => Node(grandParent)) : ''}
        `) : ''}
    </g>
` : '';
};

const renderSVG = (tree) => `
    <svg width="1000" height="1000" xmlns="http://www.w3.org/2000/svg">
     <style>
        text {
          font-family: monospace;
          font-size: 14px;
        }
        .node {
          stroke-linecap: round;
        }
        .link {
          fill: none;
        }
      </style>
      ${Node(tree)}     
    </svg>
  `;
fs.writeFile('familytree.svg', renderSVG(buildPerson('3')), () => {
  console.log('SVG created');
});
