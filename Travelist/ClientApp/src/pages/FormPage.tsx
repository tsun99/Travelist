import { useState, useEffect } from 'react';
import { useForm, Controller  } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router';

import { geocodeAddress, reverseGeocode } from '../api/coordsService.ts';
import { getDestinationById , createDestination, updateDestination } from '../api/destinationService.ts';
import Button from '../components/Button/Button.tsx';
import FormInput from '../components/FormInput/FormInput.tsx';
import ItemsToPackInput from '../components/ItemsToPackInput/ItemsToPackInput.tsx';
import { RootState } from '../redux/stores/store.ts';
import { DestinationType, updateDestinationType } from '../types/destinationTypes.ts';

export type FormValues = {
  title: string;
  city: string;
  text: string;
  address: string;
  imageUrl: string;
  itemsToPack: string;
};

export type FormProps = {
  isEditing?: boolean;
};

export function FormPage({ isEditing }: FormProps) {

  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [stateError, setStateError] = useState('');
  const [destinationTitle, setDestinationTitle] = useState('');
  const { currentUser } = useSelector((state: RootState) => state.user);

  const formMethods = useForm<FormValues>({
    defaultValues: {
      title: '',
      city: '',
      text: '',
      address: '',
      imageUrl: '',
      itemsToPack: '',
    },
    mode: 'onBlur', // or 'onBlur' or 'onChange'
    criteriaMode: 'all',
    reValidateMode: 'onChange',
    shouldFocusError: true,
  });
  const { register, handleSubmit, reset, formState, control  } = formMethods;
  const { errors } = formState;

  useEffect(() => {
    const fetchDestination = async () => {
      try {
        setLoading(true);
        const result = await getDestinationById(Number(id));
      
        // Add check here after fetching destination data
        if (currentUser && result.user && currentUser.username !== result.user.username) {
          navigate('/');
          return; // Stop further execution
        }

        let address = '';
        if (result.location) {
          try {
            address = await reverseGeocode(result.location.latitude, result.location.longitude);
          } catch (err) {
          // Error handling for reverse geocoding
          }
        }
        if (result.title) {
          setDestinationTitle(result.title);
        }

        const formData = {
          ...result,
          address,
          itemsToPack: result.itemsToPack.join(', ')
        };

        reset(formData);

      } catch (err) {
      // Error handling
      } finally {
        setLoading(false);
      }
    };

    if (id && isEditing) {
      fetchDestination().catch(console.error);
    } else if (!isEditing) {
      reset({
        title: '',
        city: '',
        text: '',
        address: '',
        imageUrl: '',
        itemsToPack: '',
      });
    }
  }, [id, reset, isEditing, currentUser, navigate]);

  const submitHandler = async (data: FormValues) => {
    let location;
    try {
      const coords = await geocodeAddress(data.address);
      if (coords) {
        location = {
          longitude: coords.longitude,
          latitude: coords.latitude,
        };
      }
    } catch (err) {
      // console.log(err instanceof Error ? err.message : 'unknown error when geocoding location address');
    }
    const destinationData: Partial<DestinationType> = {
      title: data.title,
      city: data.city,
      text: data.text,
      imageUrl: data.imageUrl,
      itemsToPack: data.itemsToPack.split(',').map(item => item.trim()),
    };
    if (location) {
      destinationData.location = location;
    }
    try {

      if (isEditing) {

        if(!id) {
          navigate('/');
          return;
        }
        destinationData.id = parseInt(id, 10);
        await updateDestination(destinationData as updateDestinationType) as DestinationType;
        navigate(`/location/${id}`);

      } else {

        await createDestination(destinationData as DestinationType);
        navigate('/');
      }

    } catch (err) {
      setStateError(err instanceof Error ? err.message : 'unknown error when creating destination');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (stateError) return <div>Error: {stateError}</div>;

  return (
    <div className="mx-auto mb-[7rem] mt-[5rem] w-[75vw] rounded-xl bg-white px-6 py-12 shadow-md sm:w-[26rem] md:w-[32rem]">
      <h1 className='p-4 text-center text-3xl font-bold md:text-4xl'>{`${!isEditing ? 'Create a Destination' : `Edit Destination "${destinationTitle}"`}`}</h1>
      <div className="mx-auto flex  items-center space-x-4  ">
        <form
          className="w-full"
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          onSubmit={handleSubmit(submitHandler)}
          noValidate
        >
          <FormInput
            label="Title"
            placeholder='Experience in the heart of France'
            id="title"
            register={register}
            requiredMessage="Title is required"
            error={errors.title}
          />
          <FormInput
            label="City"
            placeholder='Paris'
            id="city"
            register={register}
            requiredMessage="City is required"
            error={errors.city}
          />
          <FormInput
            label="About"
            placeholder='Paris gets visited by millions of t...'
            id="text"
            register={register}
            requiredMessage="About is required"
            error={errors.text}
          />
          <FormInput
            label="Address"
            placeholder='Paris, France'
            id="address"
            register={register}
            requiredMessage="Address is required"
            error={errors.address}
          />
          <FormInput
            label="Image URL"
            placeholder='https://imageadress.com/paris-medium.jpg'
            id="imageUrl"
            register={register}
            requiredMessage="Image URL is required"
            error={errors.imageUrl}
          />
          <Controller
            name="itemsToPack"
            rules={{ required: 'Please add some items' }}
            control={control}
            render={({ field: { onChange, value } }) => (
              <ItemsToPackInput
                value={value}
                id='itemsToPack'
                placeholder='Sunglasses'
                label='Items to Pack'
                onChange={onChange}
                error={errors.itemsToPack}
              />
            )}
          />
          <div className="flex gap-2 pt-4">
            <Button
              className='bg-green border-gray-hover hover:bg-green-hover mt-8 w-full rounded-lg py-3 font-bold text-white transition duration-200 ease-in-out disabled:bg-green-200'
              title={isEditing ? 'Update' : 'Save'}
              type="submit"
              theme="green"
            />
          </div>
        </form>
      </div>
    </div>
  );
}
export default FormPage;

FormPage.defaultProps = {
  isEditing: false
};
