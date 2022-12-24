import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

const useSimpleForm = () => {
  const [key] = useState(uuidv4());

  const triggerSubmit = () => {
    document.querySelectorAll('form').forEach((element) => {
      const id = element.getAttribute('id');
      if (!id || id !== key) {
        return;
      }

      const button = element.querySelector('button');
      if (button) {
        button.click();
      }
    });
  };

  return {
    key,
    triggerSubmit,
  };
};

export default useSimpleForm;
