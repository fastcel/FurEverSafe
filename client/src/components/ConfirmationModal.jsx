import React from 'react';

const ConfirmationModal = ({ type, name, onClose, onConfirm }) => {
    const isAccept = type === 'accept';

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-[#EDEFD7] p-8 border-2 border-black max-w-sm w-full text-center shadow-xl">
                <div className="bg-orange-500 text-white w-16 h-16 rounded-full flex items-center justify-center text-4xl mx-auto mb-4 font-bold">!</div>

                <h3 className="text-xl font-bold text-[#C2185B] mb-4">
                    {isAccept ? "Are you sure you want to accept this application?" : "Are you sure you want to reject this application?"}
                </h3>

                <p className="text-sm mb-8 text-[#C2185B]">
                    {isAccept
                        ? "Accepting it will automatically decline the remaining applications."
                        : "This is an undoable action and cannot be undone."}
                </p>

                <div className="flex gap-4">
                    <button onClick={onClose} className="flex-1 bg-[#D98282] py-2 border-2 border-black font-bold">No, Go Back</button>
                    <button onClick={onConfirm} className={`flex-1 ${isAccept ? 'bg-[#A8E6A1]' : 'bg-[#A8E6A1]'} py-2 border-2 border-black font-bold`}>
                        {isAccept ? "Yes, Accept" : "Yes, Reject"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;