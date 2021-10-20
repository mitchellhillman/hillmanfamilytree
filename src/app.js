'use strict';

// eslint-disable-next-line no-unused-vars
const app = {

  getName: ({
    firstname, middlename, lastname, suffix, maidenname
  }) => `${firstname || ''} ${middlename ? `${middlename.charAt(0)}. ` : ''} ${maidenname ? `(${maidenname}) ` : ''}${lastname || ''} ${suffix || ''}`,

  getDates: ({ birthdate, deathdate }) => {
    const birthYear = birthdate ? new Date(birthdate).getFullYear() : '';
    const deathYear = deathdate ? new Date(deathdate).getFullYear() : '';
    return (birthdate || deathdate) && `${birthYear} - ${deathYear}`;
  },

  addRelationships: (family) => family.map(person => {
    const children = family
      .reduce((acc, curr) => {
        if (person.id && (curr.father === person.id || curr.mother === person.id)) {
          acc.push(curr);
        }
        return acc;
      }, []);

    const fatherIds = children.map(child => child.father);
    const motherIds = children.map(child => child.mother);
    const parentIds = [...fatherIds, ...motherIds]
      .reduce((acc, curr) => {
        if (!acc.includes(curr)) acc.push(curr);
        return acc;
      }, [])
      .filter(id => id !== person.id);

    const partners = family.reduce((acc, curr) => {
      if (curr.id && parentIds.includes(curr.id)) {
        acc.push(curr);
      }

      return acc;
    }, []);

    const spouses = family.reduce((acc, curr) => {
      if (curr.id && person.spouse === curr.id) {
        acc.push(curr);
      }
      return acc;
    }, []);

    return { ...person, children, partners: [...spouses, ...partners] };
  })

};
