import data from "./data.js";
import fs from "fs";

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
      mother ? buildPerson(mother.id) : undefined,
    ],
  };
};

const getName = (person) =>
  `${person.firstname} ${person.middlename ? person.middlename + " " : ""}${
    person.lastname
  } ${person.suffix}`;

const createTable = (startPerson) => {
  const table = [];

  const createRow = (person, count = 0) => {
    if (!person) return;
    if(!person) return
    if (person.parents?.length) {
      count++      
      const couple = person.parents.map((parent) => createRow(parent, count));
      if(table[count]) {
        console.log("table[count]", table[count]);
        table[count].push(couple)
      } else {
        table[count] = [couple]
      }
    }
    return getName(person);
  };

  table.unshift(createRow(startPerson));   

  return table;
};

const myTree = createTable(buildPerson("3"));
const renderSVG = (tree) => {
  const table = `

<svg width="1000" height="1000" xmlns="http://www.w3.org/2000/svg">
     <style>
      text {
        font-family: sans-serif;
        font-size: 16px;
      }
      .node {
        stroke-linecap: round;
      }
      .link {
        fill: none;
      }
    </style>
      ${tree.map(
        (branch, index) => branch.length ? : `<text y="${index * 20}">${branch}</text>`
      )}     
    </svg>
  
  `;
  return table;
};

console.log("myTree", myTree);

fs.writeFile("familytree.svg", renderSVG(myTree), () => {
  console.log("SVG created");
});