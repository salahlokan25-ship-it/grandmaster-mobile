/// <reference types="nativewind/types" />

declare module 'lucide-react-native' {
    import { SvgProps } from 'react-native-svg';
    import { FunctionComponent } from 'react';

    export interface LucideProps extends SvgProps {
        size?: number | string;
        absoluteStrokeWidth?: boolean;
        color?: string;
        className?: string;
        fill?: string;
    }

    // This is a wildcard re-export to capture all icons
    // But strictly typed, we might need more. 
    // For now, let's just allow the props on the *instances*.
    // Actually, module augmentation is tricky.
}

// Better approach: Augment 'react' to allow className on everything (NativeWind does this, but maybe not for SvgProps?)
import 'react';
declare module 'react' {
    interface Attributes {
        className?: string;
    }
}

