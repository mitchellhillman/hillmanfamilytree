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
  : '???');
  
const Node = (person) => (person ? `
    <svg width="100%" height="100%">
      <text x="0" y="50%">${Name(person)}</text>
      ${person.parents ? person.parents.map((parent, index) => `
        <svg height="50%" x="100" y="${`${index * 50}%`}">
          ${Node(parent)}            
        </svg>                   
      `) : ''}
    </svg>
` : '');

const renderSVG = (tree) => `
    <svg width="1200" height="1000" xmlns="http://www.w3.org/2000/svg">
     <style>
        body {margin: 0}
        svg {border: 1px solid black}
        text {
          font-family: sans-serif;
          font-size: 10px;
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
