import React, { useState } from 'react';

type GoodbyeProps = {
  name?: string;
};

const Goodbye = ({ name = 'everyone' }: GoodbyeProps) => {
  const [txtColor, setTxtColor] = useState('blue');

  const changeColor = () => setTxtColor('red');
  const revertColor = () => setTxtColor('blue');

  return (
    <h1
      onMouseEnter={changeColor}
      onMouseLeave={revertColor}
      style={{ color: txtColor }}
    >
      Goodbye {name}
    </h1>
  );
};

export default Goodbye;

