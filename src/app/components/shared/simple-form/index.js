import React, { useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

import { useForm, Controller } from 'react-hook-form';
import { Form, Select, Checkbox } from 'semantic-ui-react';

const SimpleForm = (props) => {
  const {
    name,
    loading,
    formFields,
    defaultValues,
    errors: propErrors,
    onSubmit,
  } = props;

  const {
    handleSubmit,
    register,
    reset,
    control,
    errors,
    setError,
    clearErrors,
  } = useForm({
    ...defaultValues || {},
  });

  // #region default value
  useEffect(() => {
    reset(defaultValues || {});
  }, [reset, defaultValues]);
  // #endregion

  // #region error
  useEffect(() => {
    if (propErrors) {
      clearErrors();
      Object.keys(propErrors).forEach((name) => {
        const fieldError = propErrors[name];
        const message = Array.isArray(fieldError)
          ? fieldError.join('; ')
          : fieldError;
        setError(name, { type: 'manual', message });
      });
    }
  }, [setError, clearErrors, propErrors]);
  // #endregion

  // #region node
  const node = useCallback(
    ({ node: Component, props }, name, label, disabled, hidden, required, validate) => (
      <Controller
        key={`${name}`}
        control={control}
        name={`${name}`}
        defaultValue={null}
        rules={{
          required,
          validate
        }}
        render={({ onChange, onBlur, value }) => {
          return (
            <div
              key={`${name}`}
              className={`field
                ${required ? 'required' : ''}
                ${disabled ? 'disabled' : ''}
                ${hidden ? 'd-none' : ''}
                ${errors[`${name}`] && 'error'}
              `}
            >
              <label htmlFor={`${name}`} style={{ fontWeight: '700 !important' }}>{label}</label>
              <div style={{ paddingTop: '0.5rem', paddingLeft: '0.5em', paddingRight: '0.5em' }}>
                <Component
                  value={value}
                  onChange={(d) => onChange(d)}
                  onBlur={onBlur}
                  {...props}
                />
              </div>
              {errors[`${name}`] && propErrors?.[`${name}`] !== '' && (
                <div className="ui pointing above prompt label">
                  {propErrors?.[`${name}`]}
                </div>
              )}
            </div>
          );
        }}
      />
    ), [control, errors, propErrors]);
  // #endregion

  // #region input
  const input = useCallback(
    (name, label, placeholder, disabled, hidden, inputType, required, validate) => (
      <div
        key={`${name}`}
        className={`field
          ${required ? 'required' : ''}
          ${disabled ? 'disabled' : ''}
          ${hidden ? 'd-none' : ''}
          ${errors[`${name}`] && 'error'}
        `}
      >
        <label htmlFor={`${name}`}>{label}</label>
        <input
          id={`${name}`}
          name={`${name}`}
          ref={register({
            required,
            validate,
          })}
          placeholder={placeholder}
          type={inputType ?? 'text'}
        />
        {errors[`${name}`] && propErrors?.[`${name}`] !== '' && (
          <div className="ui pointing above prompt label">
            {propErrors?.[`${name}`]}
          </div>
        )}
      </div>
    ), [register, errors, propErrors]);
  // #endregion

  // #region textarea
  const textarea = useCallback(
    (name, label, placeholder, disabled, hidden, required) => (
      <div
        key={`${name}`}
        className={`field
          ${required ? 'required' : ''}
          ${disabled ? 'disabled' : ''}
          ${hidden ? 'd-none' : ''}
          ${errors[`${name}`] && 'error'}
        `}
      >
        <label htmlFor={`${name}`}>{label}</label>
        <textarea
          id={`${name}`}
          name={`${name}`}
          ref={register}
          placeholder={placeholder}
        />
        {errors[`${name}`] && propErrors?.[`${name}`] !== '' && (
          <div className="ui pointing above prompt label">
            {propErrors?.[`${name}`]}
          </div>
        )}
      </div>
    ), [register, errors, propErrors]);
  // #endregion
  
  // #region select
  const select = useCallback(
    (name, options, label, multiple, search, disabled, hidden, required, validate) => (
      <Controller
        key={`${name}`}
        control={control}
        name={`${name}`}
        defaultValue={null}
        rules={{
          required,
          validate
        }}
        render={({ onChange, onBlur, value }) => {
          let multipleValue = [];
          if (multiple && value)
            multipleValue = value;

          return (
            <div
              key={`${name}`}
              className={`field
                ${required ? 'required' : ''}
                ${disabled ? 'disabled' : ''}
                ${hidden ? 'd-none' : ''}
                ${errors[`${name}`] && 'error'}
              `}
            >
              <label htmlFor={`${name}`}>{label}</label>
              <Select
                fluid
                search={search || true}
                deburr
                clearable
                multiple={multiple}
                options={options}
                value={multiple ? multipleValue : value}
                onChange={(_, d) => onChange(d.value)}
                onBlur={onBlur}
              />
              {errors[`${name}`] && propErrors?.[`${name}`] !== '' && (
                <div className="ui pointing above prompt label">
                  {propErrors?.[`${name}`]}
                </div>
              )}
            </div>
          );
        }}
      />
    ), [control, errors, propErrors]);
  // #endregion
  
  // #region checkbox
  const checkbox = useCallback(
    (name, label, disabled, hidden, required, validate) => (
      <Controller
        key={`${name}`}
        control={control}
        name={`${name}`}
        defaultValue={null}
        rules={{
          required,
          validate
        }}
        render={({ onChange, value }) => (
          <div
            key={`${name}`}
            className={`field
              ${required ? 'required' : ''}
              ${disabled ? 'disabled' : ''}
              ${hidden ? 'd-none' : ''}
              ${errors[`${name}`] && 'error'}
            `}
          >
            <Checkbox
              label={label}
              checked={value || false}
              onChange={(e, { checked }) => onChange(checked)}
            />
            {errors[`${name}`] && propErrors?.[`${name}`] !== '' && (
              <div className="ui pointing above prompt label">
                {propErrors?.[`${name}`]}
              </div>
            )}
          </div>
        )}
      />
    ), [control, errors, propErrors]);
  // #endregion
  return (
    <Form id={`${name}`} loading={loading} onSubmit={handleSubmit((d) => onSubmit(d))}>
      {formFields.map((r, i) => {
        return  (
          <Form.Group key={`row_${i}`} widths="equal">
            {(r || []).map((f) => {
              switch (f.type) {
                case 'node':
                  return node(
                    { node: f.node, props: f.props },
                    f.name,
                    f.label,
                    f.disabled,
                    f.hidden,
                    f.required,
                    f.validate
                  );
                case 'input':
                  return input(
                    f.name,
                    f.label,
                    f.placeholder,
                    f.disabled,
                    f.hidden,
                    f.inputType,
                    f.required,
                    f.validate
                  );
                case 'textarea':
                  return textarea(f.name, f.label, f.placeholder, f.disabled, f.hidden, f.required, f.validate);
                  case 'select':
                    return select(
                      f.name,
                      f.options ?? [],
                      f.label,
                      f.multiple,
                      f.search,
                      f.disabled,
                      f.hidden,
                      f.required,
                      f.validate
                    );
                  case 'checkbox':
                    return checkbox(f.name, f.label, f.disabled, f.hidden, f.required, f.validate);
                default:
                  return null;
              }
            })}
          </Form.Group>
        )
      })}
      <button hidden type="submit" />
    </Form>
  );
};

SimpleForm.propTypes = {
  formFields: PropTypes.arrayOf(
    PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        type: PropTypes.oneOf(['node', 'input', 'textarea', 'checkbox', 'select']),
        label: PropTypes.string,
        disabled: PropTypes.bool,
        hidden: PropTypes.bool,
        required: PropTypes.bool,
        validate: PropTypes.func,
        // node
        node: PropTypes.any,
        props: PropTypes.shape({}),
        // input
        inputType: PropTypes.string,
        placeholder: PropTypes.string,
        // select
        options: PropTypes.arrayOf(
          PropTypes.shape({
            label: PropTypes.string,
            value: PropTypes.any,
          })
        ),
        multiple: PropTypes.bool,
        search: PropTypes.func,
      })
    )
  ),
  onSubmit: PropTypes.func
}

SimpleForm.defaultProps = {
  formFields: [],
  onSubmit: () => {}
}

export default SimpleForm;
