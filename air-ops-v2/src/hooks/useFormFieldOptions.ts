import { useCountryOptions } from "./useCountryOptions";
import { useGenderOptions } from "./useGenderOptions";
import { useMaritalStatusOptions } from "./useMaritalStatusOptions";
import { useReligionOptions } from "./useReligionOptions";

export const useFormFieldOptions = () => {
  const genderOptions = useGenderOptions();
  const maritalStatusOptions = useMaritalStatusOptions();
  const religionOptions = useReligionOptions();
  const countryOptions = useCountryOptions();

  return {
    gender: genderOptions,
    maritalStatus: maritalStatusOptions,
    religion: religionOptions,
    country: countryOptions,
  };
};
