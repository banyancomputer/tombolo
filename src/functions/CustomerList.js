import CardMobile from "@/components/cards/deal/CardMobile";
import FileStatus from "./FileStatus";


function CustomerCard({ id, name, status, size, onClickFileView, onClickDelete, isFiles, onClick }) {
    return (
      <>
        <CardMobile
          id={id}
          name={name}
          status={FileStatus(status)}
          size={size}
          isFiles={isFiles}
          onClick={onClick}
          onClickFileView={() => isFiles ? onClickFileView : (window.location.href = '/files/' + id)}
          onClickDelete={onClickDelete}
         
        />
      </>
    );
  };


  const CustomerList = ({ data, onClickFileView = () => {}, onClickDelete = () => {}, isFiles = true, onClick = () => {} }) => {
    return (
      <div>
        {data.map((customer) => (
          <CustomerCard
            key={customer.id}
            id={customer.id}
            name={customer.name}
            status={customer.status}
            size={customer.size + ' GiB'}
            isFiles={isFiles}
            onClick={onClick} // only for file view 
            onClickFileView={onClickFileView} // only for upload view
            onClickDelete={onClickDelete} // only for upload view
          />
        ))}
      </div>
    );
  };

  export default CustomerList;