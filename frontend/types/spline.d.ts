declare module '@splinetool/react-spline' {
  import { ComponentType } from 'react';

  interface SplineProps {
    scene: string;
    onLoad?: (splineApp: any) => void;
    onSplineMouseDown?: (e: any) => void;
    onSplineMouseUp?: (e: any) => void;
    onSplineMouseHover?: (e: any) => void;
    onSplineKeyDown?: (e: any) => void;
    onSplineKeyUp?: (e: any) => void;
    onSplineStart?: (e: any) => void;
    className?: string;
    style?: React.CSSProperties;
  }

  const Spline: ComponentType<SplineProps>;
  export default Spline;
}