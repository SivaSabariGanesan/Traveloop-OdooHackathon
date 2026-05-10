export interface LoginFormValues {
  username: string;
  password: string;
}

export interface RegisterFormValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  country: string;
}

export type ValidationErrors<T> = Partial<Record<keyof T, string>>;

const alphaRegex = /^[A-Za-z]+$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\+?[0-9\s.\-()]{7,20}$/;

export const validateLoginField = (
  field: keyof LoginFormValues,
  value: string
): string => {
  const trimmed = value.trim();

  if (field === "username") {
    if (!trimmed) return "Username is required.";
    if (trimmed.length < 3) return "Username must be at least 3 characters.";
    return "";
  }

  if (field === "password") {
    if (!trimmed) return "Password is required.";
    if (trimmed.length < 6) return "Password must be at least 6 characters.";
    return "";
  }

  return "";
};

export const validateLoginForm = (
  form: LoginFormValues
): ValidationErrors<LoginFormValues> => ({
  username: validateLoginField("username", form.username),
  password: validateLoginField("password", form.password),
});

export const validateRegisterField = (
  field: keyof RegisterFormValues,
  value: string
): string => {
  const trimmed = value.trim();

  if (field === "firstName" || field === "lastName") {
    if (!trimmed) return `${field === "firstName" ? "First name" : "Last name"} is required.`;
    if (!alphaRegex.test(trimmed)) return `${field === "firstName" ? "First name" : "Last name"} must contain only letters.`;
    return "";
  }

  if (field === "email") {
    if (!trimmed) return "Email address is required.";
    if (!emailRegex.test(trimmed)) return "Enter a valid email address.";
    return "";
  }

  if (field === "phone") {
    if (!trimmed) return "";
    if (!phoneRegex.test(trimmed)) return "Enter a valid phone number.";
    return "";
  }

  return "";
};

export const validateRegisterForm = (
  form: RegisterFormValues
): ValidationErrors<RegisterFormValues> => ({
  firstName: validateRegisterField("firstName", form.firstName),
  lastName: validateRegisterField("lastName", form.lastName),
  email: validateRegisterField("email", form.email),
  phone: validateRegisterField("phone", form.phone),
  city: "",
  country: "",
});
