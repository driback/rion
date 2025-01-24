'use client';

import { useLayoutEffect, useState } from 'react';
import { getGreeting } from '~/lib/utils';

const Greetings = () => {
  const [isVisible, setVisible] = useState(false);

  useLayoutEffect(() => {
    if (window !== undefined) {
      setVisible(true);
    }
  }, []);

  return (
    <h1 className="font-medium text-[clamp(2rem,-1.5rem+8vw,3rem)] leading-none">
      {isVisible ? (
        getGreeting()
      ) : (
        <>
          Good{' '}
          <span className="animate-pulse bg-secondary text-transparent">
            lorem
          </span>
        </>
      )}
    </h1>
  );
};

export default Greetings;
