import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
import { useTensorflowModel } from 'react-native-fast-tflite'
import { Camera, useCameraDevice, useFrameProcessor, useSkiaFrameProcessor, VisionCameraProxy } from 'react-native-vision-camera'
import { useFaceDetector } from 'react-native-vision-camera-face-detector'
import { Worklets } from 'react-native-worklets-core'
import { Canvas, Rect, useImage, Text as SkText, useFont, Skia, PaintStyle} from '@shopify/react-native-skia'
import ImageEditor from '@react-native-community/image-editor'
import ImageResizer from '@bam.tech/react-native-image-resizer';
import { runOnJS } from 'react-native-reanimated'
import RNFS from 'react-native-fs';

const App = () => {
  const [cameraPermission, setCameraPermission] = useState(null);
  const [isPermissionGranted, setIsPermissionGranted] = useState(false);
  const [face, setFaces] = useState([])
  const [model, setModel] = useState(null)
  const [result, setResult] = useState("");
  const [captureFace, setCapturedFace] = useState(null)
  const cameraRef = useRef(null);
  const [rawPhoto, setRawPhoto]=useState("")
  const [photoUri, setPhotoUri] = useState("https://placehold.co/112x112")
  const [inputFloatArray, setFlotArray] = useState()
  const plugin = useTensorflowModel(require('./assets/mobilefacenet.tflite'))
  const image = useImage(photoUri)
  const [userName, setUserName] = useState("unknown")
  const fontSize = 32;
  const font = useFont(require("./assets/font/Nasa21.ttf"), fontSize);

  
  const userData =
  {
    userId: "user_12345",
    name: "John Doe",
    enbeddings:  [-0.0048458813689649105, 0.022807946428656578, 0.010458334349095821, 0.005741703789681196, -0.058587972074747086, 0.049020521342754364, -0.09603127837181091, 0.021436220034956932, -0.12380016595125198, 0.04407629370689392, -0.0346742682158947, 0.006396939978003502, -0.004903036169707775, 0.021725565195083618, -0.0026429221034049988, 0.07740551233291626, -0.039150867611169815, -0.019553231075406075, -0.000029566113880719058, 0.012558587826788425, -0.0709962248802185, 0.012695751152932644, 0.020542552694678307, 0.01496405340731144, -0.020667586475610733, -0.018297851085662842, -0.04594451189041138, 0.015689808875322342, 0.18127453327178955, -0.14286887645721436, -0.007779436651617289, 0.24794861674308777, 0.1263999044895172, -0.0018720506923273206, -0.0339997373521328, 0.1763952225446701, 0.007810225244611502, -0.0027116776909679174, 0.005832100752741098, -0.14858177304267883, 0.00611310126259923, 0.005148438271135092, 0.015181366354227066, -0.02363298274576664, 0.016422510147094727, -0.0068170055747032166, -0.012715068645775318, -0.010999157093465328, -0.01101736631244421, 0.03737792745232582, 0.03584248572587967, -0.00531964935362339, -0.22492562234401703, -0.00486863823607564, -0.11117720603942871, 0.0010222616838291287, 0.04713017866015434, 0.0037192455492913723, -0.10180848091840744, 0.030942391604185104, 0.02005816251039505, -0.11224767565727234, -0.0547148622572422, -0.19142092764377594, -0.012185653671622276, 0.039701394736766815, -0.010041221044957638, 0.03585948422551155, 0.008740833960473537, 0.00313786743208766, -0.03300042822957039, -0.051449693739414215, 0.060277633368968964, 0.010572743602097034, -0.024556340649724007, -0.006565133575350046, 0.007389410864561796, -0.004804464057087898, 0.16983093321323395, 0.07802154123783112, -0.015346010215580463, -0.04758669063448906, -0.010905599221587181, 0.1949414759874344, -0.11071952432394028, -0.004957813769578934, -0.004546924959868193, 0.022386746481060982, -0.009806145913898945, -0.3406190872192383, 0.002283829730004072, -0.004103983286768198, 0.01962895877659321, -0.024169348180294037, -0.10783958435058594, -0.13042208552360535, 0.006793842650949955, -0.06803843379020691, -0.004844977520406246, 0.020466886460781097, 0.0030335714109241962, -0.02248058281838894, -0.006622315850108862, -0.000383753445930779, 0.0011906764702871442, 0.008296952582895756, -0.10144753754138947, 0.0065740556456148624, -0.007776092737913132, 0.011046413332223892, 0.009297044947743416, 0.005930656101554632, 0.007244255859404802, 0.2814743220806122, 0.002433028072118759, 0.06156414374709129, 0.0024593351408839226, -0.053149402141571045, 0.03269228711724281, 0.11748795956373215, 0.0782240629196167, -0.020299460738897324, -0.2485903650522232, 0.001133945770561695, 0.006192663684487343, -0.001654130988754332, 0.010410279966890812, -0.007258304860442877, -0.010206573642790318, 0.07899928092956543, 0.012376353144645691, 0.0194252822548151, -0.0036195823922753334, -0.060226429253816605, 0.08615729957818985, -0.011032132431864738, -0.1009819433093071, -0.05282507836818695, 0.0012942253379151225, 0.012778637930750847, -0.005964435636997223, 0.0011011838214471936, -0.004260711837559938, -0.00906352698802948, -0.17000539600849152, 0.19784341752529144, -0.04568152129650116, 0.0031246463768184185, 0.008743315003812313, 0.004106994718313217, -0.013782241381704807, -0.06990747153759003, 0.043003857135772705, -0.023320801556110382, -0.010834649205207825, -0.0014869743026793003, 0.016590051352977753, 0.009639500640332699, -0.14159506559371948, -0.0012968516675755382, -0.05786488577723503, 0.0020943363197147846, -0.013197201304137707, -0.0017829276621341705, 0.008157403208315372, 0.02420009858906269, 0.02565235272049904, -0.03112354874610901, 0.0003830921195913106, -0.007736138068139553, 0.10751555860042572, -0.01744563691318035, -0.0019637206569314003, -0.02256396971642971, 0.013203402049839497, 0.00641795014962554, -0.05701658874750137, -0.0374470129609108, -0.011623192578554153, 0.010711126029491425, -0.04226138815283775, 0.007399235852062702, -0.011422078125178814, -0.0014271754771471024, 0.0926070287823677, 0.051184508949518204, -0.08826009184122086, -0.019115686416625977, 0.11082805693149567, -0.08443968743085861, -0.06355824321508408, -0.010734254494309425]
  }


 const imageProessing=async(image)=>{

    if (image) {
      const width = image.width();
      const height = image.height();
      const pixelData = image.readPixels();

      const floatArray = new Float32Array(width * height * 3);
      for (let i = 0, j = 0; i < pixelData.length; i += 4, j += 3) {
        floatArray[j] = pixelData[i] / 255;       // Red channel
        floatArray[j + 1] = pixelData[i + 1] / 255; // Green channel
        floatArray[j + 2] = pixelData[i + 2] / 255; // Blue channel
      }
      console.log("Float32Array:", floatArray.length);
      
      await handleModelOutput(floatArray)
    }
  } // Dependency to run whenever image changes


  const devices = useCameraDevice('front')
  const { detectFaces } = useFaceDetector()

  useEffect(() => {
    if (plugin) {
      setModel(plugin)
      console.log("modal load sucessfully")
    } else {
      console.log("model loading failed");
    }
  }, [plugin])


  const takeSnapshot = async () => {
    console.log("takeSnapshot calling")
    if (!cameraRef.current || face.length === 0) {
      console.warn("No camera or no face detected.");
      return;
    }
    try {
      const photo = await cameraRef.current.takePhoto({
        quality: 1, // Adjust quality as needed
      });

      console.log("Photo taken:", photo);
      

      const rawPhotoUri = `file://${photo.path}`;

            setRawPhoto(rawPhotoUri)


      console.log('Formatted URI:', rawPhotoUri);

      

      const { x, y, width, height } = face[0].bounds;

      console.log(x,y,width,height)

      const frameWidth = 640; // Frame width
      const frameHeight = 480; // Frame height
  

      const photoWidth = 2304; // Actual photo width
      const photoHeight = 1728; // Actual photo height


      const scaleX = photoWidth / frameWidth;
      const scaleY = photoHeight / frameHeight;
  
      // Scale face coordinates from frame to photo
      const cropX = x * scaleX;
      const cropY = y * scaleY;
      const cropWidth = width * scaleX;
      const cropHeight = height * scaleY;


      console.log("Scaled coordinates for cropping:", cropX, cropY, cropWidth, cropHeight);

      const cropData = {
        offset: { x: cropX, y: cropY },
        size: { width:cropWidth, height: cropHeight },
        resizeMode: 'cover',
      };

      const croppedImageUri = await ImageEditor.cropImage(rawPhotoUri, cropData);

      console.log('Cropped Image URI:', croppedImageUri.path);

      resizeImage(croppedImageUri.uri)

      await RNFS.unlink(rawPhotoUri)

    } catch (error) {
      console.error("Error taking snapshot or cropping:", error);
    }
  }

  const resizeImage = async (imageUri) => {
    try {
      const resizedImage = await ImageResizer.createResizedImage(
        imageUri,
        112, // Target width
        112, // Target height
        'JPEG', // Format: 'JPEG', 'PNG', 'WEBP'
        100 // Quality (0-100)
      );
      setPhotoUri(resizedImage.uri);
      console.log('Resized Image URI:', resizedImage.uri);

      imageProessing(image)

    } catch (error) {
      console.error('Error resizing image:', error);
    }
  };


  const clearCache = async () => {
   
    try {
      const cacheDir = RNFS.CachesDirectoryPath;
      console.log("Cache directory:", cacheDir);
  
      // Remove all files in the cache directory
      await RNFS.unlink(cacheDir);
      console.log("Cache cleared successfully.");
  
      // Recreate the cache directory if needed
      await RNFS.mkdir(cacheDir);
    } catch (error) {
      console.error("Error clearing cache:", error);
    }
  };

useEffect(() => {
  // Check if faces are detected (face array is not empty)
  if (face.length > 0) {
    takeSnapshot(); // Call takeSnapshot when a face is detected
  }
}, [face]); 


  const handleModelOutput = async (inputFloatArray) => {
    console.log("modal calling")

    try {
      
      const inferenceResult = await model.model.run([inputFloatArray]);
      if (Array.isArray(inferenceResult)) {
        const output = inferenceResult;
        setResult(output[0]);

        const point1 = result
        console.log(result)
        const point2 = userData.enbeddings

        const distance = calculateEuclideanDistance(point1, point2)

        console.log('Euclidean Distance:', distance);

        if (distance < 0.4) {
          setUserName("rohit")
          
        } else {
          setUserName("unknown")
      
        }

      } else {
        setResult("Inference failed: Invalid result format.");
      }
    } catch (error) {
      console.error("Error during inference:", error);
    }
  }


  const calculateEuclideanDistance = (point1, point2) => {
    let sumOfSquares = 0;

    for (let i = 0; i < point1.length; i++) {
      sumOfSquares += Math.pow(point1[i] - point2[i], 2);
    }

    return Math.sqrt(sumOfSquares);
  };



  const handleDetectFace = Worklets.createRunOnJS(faces => {
    if (faces.length > 0) {
      setFaces(faces)
      console.log(faces)
    } else {
      console.log('No faces detected');
    }
  })



  const frameProcessor = useFrameProcessor((frame) => {
    'worklet';
    try {
      const faces = detectFaces(frame); // Detect faces
      console.log("height",frame.height)
      console.log("width",frame.width)
      handleDetectFace(faces)
    } catch (error) {
      console.error(error.stack);
    }
  }, []);

  useEffect(() => {
    const requestPermission = async () => {
      try {
        const status = await Camera.requestCameraPermission();
        setCameraPermission(status);
        if (status === 'granted') {
          setIsPermissionGranted(true);
        } else {
          console.warn('Camera permission denied:', status);
        }
      } catch (error) {
        console.error('Permission request error:', error);
      }
    };
    requestPermission();
  }, []);

  return (
    <View style={styles.container}>
      {isPermissionGranted && devices ? (
        <>
          <Camera
            ref={cameraRef}
            photo={true}
            style={StyleSheet.absoluteFill}
            device={devices}
            isActive={true}
            frameProcessor={frameProcessor}
          />
          <Canvas style={StyleSheet.absoluteFill}>

            {face.map((face, index) => (
              <>
                <Rect
                  key={index}
                  x={face.bounds.x / 1.5}
                  y={face.bounds.y}
                  width={face.bounds.width * 1.3}
                  height={face.bounds.height * 2}
                  color="rgba(255, 0, 0, 0.5)" // Semi-transparent red
                  style="stroke"
                  strokeWidth={4}
                />
                <SkText
                x={face.bounds.x / 1.5}
                y={50}
                text={`Hello, ${userName}!`}
                font={font}
                color="white"
              />
              </>
            ))}
          </Canvas>
          {/* <TouchableOpacity style={styles.button} onPress={takeSnapshot}>
            <Text style={styles.buttonText}>Capture Face</Text>
          </TouchableOpacity>
          <Text style={{
            textAlign: 'center', position: 'absolute', backgroundColor: "white",
            bottom: 100, fontSize: 20, padding: 20
          }}>{userName}</Text>
          <TouchableOpacity style={styles.modelbutton} onPress={handleModelOutput}>
            <Text style={styles.buttonText}>run model</Text>
          </TouchableOpacity> */}
        </>
      ) : (
        <View style={styles.centeredView}>
          <Text style={styles.text}>
            {cameraPermission === 'denied'
              ? 'Camera permission denied. Please enable it in settings.'
              : 'Requesting camera permission...'}
          </Text>
        </View>
      )}
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  text: {
    color: '#fff',
    fontSize: 16,
  },
  button: {
    width: 10,
    height: 10,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#000',
  },
  button: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'flex-end',
    backgroundColor: 'red',
    padding: 15,
    borderRadius: 10,
  },
  modelbutton: {
    position: 'absolute',
    bottom: 20,

    backgroundColor: 'red',
    padding: 15,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  image: {
    width: 200,
    height: 200,
    marginTop: 20,
    resizeMode:'contain'
  },
});

export default App


