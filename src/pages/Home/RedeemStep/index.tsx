import Button from '@/components/Button';

const RedeemStep = () => {
  const startRedeem = async () => {
    console.log('startRedeem');
  };

  return (
    <div className='w-full'>
      <Button text='Transfer' style='purple' className='w-full' onClick={startRedeem} />
    </div>
  );
};

export default RedeemStep;
