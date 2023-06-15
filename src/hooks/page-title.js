import React from 'react';
export default function PageTitle(title) {
    React.useEffect(() => {
        const prevTitle = document.title
        document.title = title ;
        return () => {
            document.title = prevTitle
        }
    })
}