import React from 'react';

type HelloProps = {
  name?: string;
};

const Hello = ({ name }: HelloProps) => {
  const greeting = name ? `Hello ${name}` : 'Hello World';

  return <h1>{greeting}</h1>;
};

export default Hello;

