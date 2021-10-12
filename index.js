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

const createTable = (startPerson) => {
  const table = [];

  const createRow = (person, count = 0) => {
    if (!person) return;
    if (!person) return;
    if (person.parents?.length) {
      count++;
      const couple = person.parents.map((parent) => createRow(parent, count));
      if (table[count]) {
        table[count].push(couple);
      } else {
        table[count] = [couple];
      }
    }
    return person;
  };

  table.unshift(createRow(startPerson));

  return table.filter((n) => n);
};

const myTree = createTable(buildPerson("3"));

const nodeWidth = 200;

const Name = ({ person }) => {
  return person
    ? `${person.firstname} ${person.middlename ? person.middlename + " " : ""}
      ${person.lastname} ${person.suffix}`
    : "";
};

const Person = ({ person, genIndex, coupleIndex, personIndex }) => {
  return `<text x="${
    personIndex * nodeWidth + coupleIndex * (nodeWidth * 3)
  }" y="${(genIndex + 1) * 40}">${Name({ person })}</text>`;
};

const Tree = (tree) => {
  return tree.map((gen, genIndex) => {
    if (Array.isArray(gen)) {
      return gen.map((couple, coupleIndex) => {
        return couple.map((person, personIndex) =>
          Person({ person, coupleIndex, genIndex, personIndex })
        );
      });
    } else {
      return Person({
        person: gen,
        genIndex: 0,
        coupleIndex: 0,
        personIndex: 0,
      }); // first gen
    }
  });
};

const renderSVG = (tree) => {
  return `
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
      ${Tree(tree)}     
    </svg>
  `;
};

fs.writeFile("familytree.svg", renderSVG(myTree), () => {
  console.log("SVG created");
});
