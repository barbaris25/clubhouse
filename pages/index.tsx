import React from 'react';
import { WelcomeStep } from '../components/steps/WelcomeStep';
import { EnterNameStep } from '../components/steps/EnterNameStep';
import { GithubStep } from '../components/steps/GithubStep';
import { ChooseAvatarStep } from '../components/steps/ChooseAvatarStep';
import { EnterPhoneStep } from '../components/steps/EnterPhoneStep';
import { EnterCodeStep } from '../components/steps/EnterCodeStep';

const stepsComponent = {
  0: WelcomeStep,
  1: GithubStep,
  2: EnterNameStep,
  3: ChooseAvatarStep,
  4: EnterPhoneStep,
  5: EnterCodeStep,
};

export type UserData = {
  id: number;
  fullName: string;
  avatarUrl: string;
  isActive: boolean;
  userName: string;
  phone: string;
  token?: string;
};

type MainContextProps = {
  onNextStep: () => void;
  setUserData: React.Dispatch<React.SetStateAction<UserData>>;
  setFieldValue: (field: string, value: string) => void;
  step: number;
  userData: UserData;
};

export const MainContext = React.createContext<MainContextProps>(
  {} as MainContextProps
);

export default function Home() {
  const [step, setStep] = React.useState<number>(0);
  const [userData, setUserData] = React.useState<UserData>();
  const Step = stepsComponent[step];

  const onNextStep = () => {
    setStep(step + 1);
  };

  const setFieldValue = (field: keyof UserData, value: string) => {
    setUserData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <MainContext.Provider
      value={{ step, userData, onNextStep, setUserData, setFieldValue }}
    >
      <Step />
    </MainContext.Provider>
  );
}
