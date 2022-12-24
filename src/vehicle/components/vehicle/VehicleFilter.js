import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { SearchBar } from 'app/components/shared';
import { useSelector } from 'react-redux';

const Wrapper = styled.div`
  display: flex;
`;

const VehicleFilter = ({ actions, onChange: onChangeProps }) => {
  const { getVehiclesLoading } = useSelector((_) => _.vehicle);

  const loading = getVehiclesLoading;

  // #region common
  const [cache, setCache] = useState(undefined);
  const formatter = useMemo(() => ({}), []);

  const onChange = (values) => {
    // eslint-disable-next-line prefer-const
    const payload =
    Object
      .keys(values)
      .reduce((builder, key) => {
        if (formatter[key]) {
          // eslint-disable-next-line no-param-reassign
          builder[formatter[key].name] = formatter[key].execute(values);
        } else {
          // eslint-disable-next-line no-param-reassign
          builder[key] = values[key];
        }
        return builder;
      }, cache || {});
    /* Trigger */
    onChangeProps(payload);
    /* Save */
    setCache(payload);
  };
  // #endregion

  return (
    <Wrapper>
      <SearchBar
        placeholder="Từ khoá"
        actions={actions}
        loading={loading}
        onChange={(keyword) => onChange({ keyword })}
        onEnter={(keyword) => onChange({ keyword })}
      />
    </Wrapper>
  );
};

VehicleFilter.propTypes = {
  /** Actions */
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.number,
      icon: PropTypes.node,
      content: PropTypes.string,
      onClick: PropTypes.func,
      color: PropTypes.oneOf([
        'facebook',
        'google plus',
        'vk',
        'twitter',
        'linkedin',
        'instagram',
        'youtube',
        'red',
        'orange',
        'yellow',
        'olive',
        'green',
        'teal',
        'blue',
        'violet',
        'purple',
        'pink',
        'brown',
        'grey',
        'black',
      ]),
      globalAction: PropTypes.bool,
      dropdown: PropTypes.bool,
      dropdownActions: PropTypes.arrayOf(
        PropTypes.shape({
          onDropdownClick: PropTypes.func,
          titleDropdown: PropTypes.string,
          dropdownHidden: PropTypes.bool,
          dropdownDisabled: PropTypes.bool,
        }),
      ),
      disabled: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
      hidden: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
    }),
  ),
  /** onChange */
  onChange: PropTypes.func,
};

VehicleFilter.defaultProps = {
  /** Actions */
  actions: [],
  /** OnChange */
  onChange: () => {},
};

export default VehicleFilter;
