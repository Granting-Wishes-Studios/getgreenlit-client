export  const Loader  = (props) => {

    return (
        <div className={`flex justify-center items-center py-1 ml-2 flex-column relative`} style={{display: "inline-table", verticalAlign: 'middle'}}>
            <div className={`animate-spin rounded-full h-3 w-3 border-b-2 border-white ${props.className}`} />
        </div>
    )
}