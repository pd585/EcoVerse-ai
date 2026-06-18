/**
 * UI components barrel export.
 * @module components/ui
 */

export { Button, buttonVariants } from './Button';
export type { ButtonProps } from './Button';

export {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from './Card';
export type { CardProps } from './Card';

export { Input } from './Input';
export type { InputProps } from './Input';

export {
  Modal,
  ModalTrigger,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalTitle,
  ModalDescription,
  ModalClose,
} from './Modal';

export { Loader } from './Loader';
export type { LoaderProps } from './Loader';

export { Counter } from './Counter';
export type { CounterProps } from './Counter';

export { Progress } from './Progress';
export type { ProgressProps } from './Progress';

export { Badge, badgeVariants } from './Badge';
export type { BadgeProps } from './Badge';

export { Tabs, TabsList, TabsTrigger, TabsContent } from './Tabs';

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from './Tooltip';
