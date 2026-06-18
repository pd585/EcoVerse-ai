import { cn } from '@/lib/utils';
import { RobotSeedlingIcon } from '../branding/RobotSeedlingIcon';

export interface RobotSeedlingLogoProps {
  className?: string;
  animated?: boolean;
  showWordmark?: boolean;
}

export function RobotSeedlingLogo({
  className,
  animated = true,
  showWordmark = true,
}: RobotSeedlingLogoProps) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <RobotSeedlingIcon size={36} animated={animated} className="h-9 w-9" />
      {showWordmark && (
        <span className="font-display text-lg font-700 tracking-normal text-white">
          Eco<span className="text-gradient">Verse</span>
          <span className="ml-1 align-super text-[0.6rem] font-600 text-aurora">AI</span>
        </span>
      )}
    </span>
  );
}
