import { Suspense, useState, useRef, isValidElement } from 'react';

interface ILoadFirst {
  children: React.ReactNode | React.ReactNode[],
  loading?: React.ReactNode,
}

const LoadFirst = ({loading, children}: ILoadFirst) => {
  if (!children) { throw Error('No children found') }

  return (
    <Suspense fallback={loading}>
      {children}
    </Suspense>
  )
}

interface IPrioritize {
  children: any
}

// A Resource is an object with a read method returning the payload
interface Resource<P> {
  read: () => P;
};
    
type Status = {
  status: "pending" | "success" | "error",
  res: any,
}

// this function let us get a new function using the asyncFn we pass
// this function also receives a payload and return us a resource with
// that payload assigned as type
const createResource = <T,>(
  asyncFn: () => Promise<T>
): Resource<T> => {

  // we start defining our resource is on a pending status
  const status = useRef<Status>({
    status: "success",
    res: null,
  });
  // and we create a variable to store the result
  // then we immediately start running the `asyncFn` function
  // and we store the resulting promise
  const promise = asyncFn().then(
    (r: T) => {
      // once it's fulfilled we change the status to success
      // and we save the returned value as result
      status.current = {
        status: "success",
        res: r,
      };
    },
    (e: Error) => {
      // once it's rejected we change the status to error
      // and we save the returned error as result
      status.current = {
        status: "error",
        res: e,
      }
    }
  );

  // lately we return an error object with the read method
  return {
    read() {
    // here we will check the status value
      switch (status.current.status) {
        case "pending":
          // if it's still pending we throw the promise
          // throwing a promise is how Suspense know our component is not ready
          throw promise;
        case "error":
          // if it's error we throw the error
          throw status.current.res;
        case "success":
          // if it's success we return the result
          return status.current.res;
      }
    },
  };
};

const Prioritize = ({children}: IPrioritize) => {
  createResource<string>(
    () => new Promise((resolve, reject) => {
      const assetSrc = children.props.src;

      const img = new window.Image();
      img.src = assetSrc;
    
      img.addEventListener("load", () => resolve(assetSrc));
      img.addEventListener("error", (e) => reject(new Error(`Failed to load src ${assetSrc}\n${e}`)));
    })
  ).read();

  return (
    <Suspense>
      {children}
    </Suspense>
  )
}

export { LoadFirst, Prioritize }
