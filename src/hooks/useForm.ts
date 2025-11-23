import { useState, useCallback, useRef, useEffect } from 'react';
// TaskFormData is not used in this file

export interface FormErrors {
  [key: string]: string;
}

export function useForm<T extends Record<string, any>>(
  initialValues: T,
  validate?: (values: T) => FormErrors
) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const isDirtyRef = useRef(false);

  useEffect(() => {
    isDirtyRef.current = JSON.stringify(values) !== JSON.stringify(initialValues);
  }, [values, initialValues]);

  const handleChange = useCallback((name: string, value: any) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    setTouched((prev) => ({ ...prev, [name]: true }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  }, [errors]);

  const handleBlur = useCallback((name: string) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
  }, []);

  const validateForm = useCallback((): boolean => {
    if (!validate) return true;

    const validationErrors = validate(values);
    setErrors(validationErrors);
    setTouched(
      Object.keys(values).reduce((acc, key) => {
        acc[key] = true;
        return acc;
      }, {} as Record<string, boolean>)
    );

    return Object.keys(validationErrors).length === 0;
  }, [values, validate]);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    isDirtyRef.current = false;
  }, [initialValues]);

  const setFieldValue = useCallback((name: string, value: any) => {
    handleChange(name, value);
  }, [handleChange]);

  return {
    values,
    errors,
    touched,
    isDirty: isDirtyRef.current,
    handleChange,
    handleBlur,
    validateForm,
    reset,
    setFieldValue,
    setValues,
  };
}

