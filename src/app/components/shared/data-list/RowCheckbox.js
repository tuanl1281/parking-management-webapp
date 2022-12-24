import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Checkbox } from 'semantic-ui-react';

const RowCheckbox = ({ checked, onChange }) => {
  const [value, setValue] = useState(checked || false);

  return (
    <Checkbox
      checked={value}
      onChange={(e) => {
        e.stopPropagation();
        onChange(!value);
        setValue(!value);
      }}
    />
  );
};

RowCheckbox.propTypes = {
  checked: PropTypes.bool,
  onChange: PropTypes.func,
};

RowCheckbox.defaultProps = {
  checked: true,
  onChange: () => {},
};

export default RowCheckbox;
