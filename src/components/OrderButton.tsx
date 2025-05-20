import React from "react";
import { ArrowDownUp } from "lucide-react";

interface PropsOrderButton{
    handleSorting: (orderCriteria:string)=> void
    criteria:string
}


const OrderButtton:React.FC<PropsOrderButton> = ({handleSorting,criteria})=> {
    return (
        <button className="order-button" onClick={() => handleSorting("id")}>
            <ArrowDownUp size={16} color="#7d807e" />
        </button>
    )
}

export default OrderButtton