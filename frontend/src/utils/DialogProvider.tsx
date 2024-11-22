// DialogContext.tsx
import {ReactNode, createContext, useContext, useState} from "react";
import {Dialog, DialogProps} from "../components/Dialog";

const DialogContext = createContext<{
    showDialog: (props: Omit<DialogProps, 'open'>) => void;
    hideDialog: () => void;
}>({
    showDialog: () => {},
    hideDialog: () => {},
});

export function DialogProvider({ children }: { children: ReactNode }) {
    const [dialogProps, setDialogProps] = useState<DialogProps | null>(null);

    const showDialog = (props: Omit<DialogProps, 'open'>) => {
        setDialogProps({ ...props, open: true });
    };

    const hideDialog = () => setDialogProps(null);

    return (
        <DialogContext.Provider value={{ showDialog, hideDialog }}>
            {children}
            {dialogProps && <Dialog {...dialogProps} />}
        </DialogContext.Provider>
    );
}

export const useDialog = () => useContext(DialogContext);