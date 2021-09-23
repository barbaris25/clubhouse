import React from 'react';
import clsx from 'clsx';
import { Axios } from '../../../core/axios';
import { WhiteBlock } from '../../WhiteBlock';
import { Button } from '../../Button';
import { StepInfo } from '../../StepInfo';
import { Avatar } from '../../Avatar';

import styles from './ChooseAvatarStep.module.scss';
import { MainContext } from '../../../pages';

const uploadFile = async (file: File): Promise<{ url: string }> => {
  const formData = new FormData();

  formData.append('photo', file);

  const { data } = await Axios({
    method: 'POST',
    url: '/upload',
    data: formData,
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return data;
};

export const ChooseAvatarStep: React.FC = () => {
  const { onNextStep, setFieldValue, userData } = React.useContext(MainContext);
  const [avatarUrl, setAvatarUrl] = React.useState<string>(
    'https://via.placeholder.com/150'
  );
  const inputFileRef = React.useRef<HTMLInputElement>(null);

  const handleChangeImage = async (event: Event) => {
    const target = event.target as HTMLInputElement;
    const file = (event.target as HTMLInputElement).files[0];

    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setAvatarUrl(imageUrl);
      const data = await uploadFile(file);
      target.value = '';
      setAvatarUrl(data.url);
      setFieldValue('avatarUrl', data.url);
    }
  };

  React.useEffect(() => {
    if (inputFileRef.current) {
      inputFileRef.current.addEventListener('change', handleChangeImage);
    }
  }, []);

  return (
    <div className={styles.block}>
      <StepInfo
        icon="/static/celebration.png"
        title={`Okay, ${userData?.fullName || ''}!`}
        description="How’s this photo?"
      />

      <WhiteBlock className={clsx('m-auto mt-40', styles.whiteBlock)}>
        <div className={styles.avatar}>
          <Avatar width="120px" height="120px" src={avatarUrl} />
        </div>

        <div className="mb-30">
          <label htmlFor="image" className="link cup">
            Choose a different photo
          </label>
        </div>

        <input id="image" ref={inputFileRef} type="file" hidden />

        <Button onClick={onNextStep}>
          Next
          <img className="d-ib ml-10" src="/static/arrow.svg" />
        </Button>
      </WhiteBlock>
    </div>
  );
};
