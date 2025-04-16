import { View, Text, StyleSheet, Image } from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
import { useTensorflowModel } from 'react-native-fast-tflite'
import { Camera, useCameraDevice, useFrameProcessor, useCameraFormat } from 'react-native-vision-camera'
import { runOnJS } from 'react-native-reanimated'
import { useFaceDetector } from 'react-native-vision-camera-face-detector'
import { Worklets } from 'react-native-worklets-core'
import { Canvas, Rect, useImage, Text as SkText } from '@shopify/react-native-skia'
import ImageEditor from '@react-native-community/image-editor'
import ImageResizer from '@bam.tech/react-native-image-resizer';

const userData =
{
  userId: "user_12345",
  name: "John Doe",
  enbeddings:  [-0.013044350780546665, 0.011562922038137913, 0.005405982490628958, -0.006656050216406584, -0.04640306904911995, 0.12693718075752258, -0.0291338749229908, 0.05237843096256256, -0.11299389600753784, 0.13108788430690765, -0.0009776660008355975, 0.0022511547431349754, 0.005280580837279558, 0.002807305660098791, -0.006222204305231571, -0.09217909723520279, -0.024482181295752525, -0.0018581425538286567, 0.004527391865849495, 0.01142129860818386, -0.045508138835430145, 0.08329912275075912, -0.042571064084768295, 0.010897413827478886, 0.0036511539947241545, 0.026804450899362564, -0.01671186462044716, 0.11413788795471191, 0.006458038929849863, 0.043775927275419235, -0.0026667676866054535, 0.06943251937627792, 0.2030417025089264, -0.007236892823129892, -0.2186894416809082, -0.018893465399742126, 0.23134401440620422, -0.025471357628703117, 0.0006176254828460515, 0.02354387938976288, -0.006775715854018927, 0.0013707278994843364, 0.00273313419893384, -0.006538168527185917, -0.0019937383476644754, -0.007748408708721399, -0.0654430240392685, -0.18917705118656158, -0.008309537544846535, -0.04628220945596695, -0.025884557515382767, 0.0005977479740977287, 0.006059644278138876, -0.0043538156896829605, 0.0224711112678051, 0.003588693914934993, -0.05910155549645424, -0.00034955303999595344, -0.09420765191316605, 0.021441858261823654, 0.04744851961731911, -0.05523601174354553, 0.03907501697540283, 0.05291040614247322, -0.017390962690114975, -0.07303312420845032, -0.002907336223870516, -0.01083608902990818, 0.010966668836772442, -0.004747082944959402, -0.018693778663873672, -0.34797534346580505, -0.07325050979852676, -0.002298761159181595, 0.01417365949600935, 0.005477935075759888, -0.003279338590800762, -0.0019263029098510742, 0.007469835225492716, 0.15331587195396423, 0.00696787191554904, -0.039628349244594574, -0.008675927296280861, -0.12702004611492157, -0.06011956185102463, -0.000013829058843839448, -0.00011753520084312186, -0.03916307911276817, -0.07276196777820587, -0.3610512614250183, 0.13639187812805176, -0.007434375584125519, -0.00449176924303174, -0.017472470179200172, -0.01979055628180504, -0.011678572744131088, -0.022512683644890785, 0.04305817559361458, 0.004307422321289778, 0.009116383269429207, 0.000686292361933738, 0.0015189875848591328, -0.01122373715043068, -0.0012788738822564483, 0.00022397249995265156, 0.0038485343102365732, -0.18655522167682648, 0.011912974528968334, 0.016299225389957428, 0.01481613889336586, 0.08367273956537247, 0.003968354314565659, 0.007539292797446251, 0.040493328124284744, 0.0070795402862131596, -0.2345713973045349, 0.008716942742466927, -0.02277906984090805, -0.07695911824703217, -0.05343439429998398, 0.022019265219569206, 0.03340590372681618, -0.06225399672985077, -0.002028328599408269, 0.000019756513211177662, 0.0043930839747190475, 0.004192006774246693, -0.006103618070483208, 0.00941415410488844, 0.030210252851247787, 0.0018586418591439724, 0.005614390131086111, -0.00001747898932080716, -0.004846899304538965, 0.009444531984627247, -0.008592711761593819, -0.16173745691776276, 0.07535631209611893, 0.002240231726318598, 0.011050134897232056, 0.015430432744324207, -0.004423179663717747, 0.006109051406383514, -0.11917722225189209, 0.12613698840141296, 0.10174152255058289, 0.00267176260240376, -0.02151116356253624, -0.00047905981773510575, -0.004773925524204969, -0.0009759245440363884, -0.05456123501062393, 0.037698857486248016, -0.016096651554107666, 0.004429709631949663, 0.009842664934694767, -0.009420989081263542, 0.013502823188900948, -0.1118307039141655, 0.001955169253051281, -0.03814416006207466, 0.0004225797893013805, 0.0065060826018452644, -0.0008554809028282762, 0.005431686993688345, 0.010848875157535076, -0.00654830876737833, 0.2501698136329651, -0.004336887039244175, -0.008579925633966923, 0.014040055684745312, 0.07608742266893387, 0.00016611597675364465, 0.12577617168426514, 0.031009647995233536, 0.0008855300256982446, -0.0789201483130455, -0.05734768882393837, -0.006589666474610567, -0.007164609618484974, 0.07585751265287399, 0.06775562465190887, -0.0033232925925403833, 0.0005512705538421869, 0.017851008102297783, 0.020418278872966766, 0.16054725646972656, 0.08712736517190933, 0.033221714198589325, -0.09449411928653717, -0.04125356674194336, 0.0063222432509064674]
}

const App = () => {
  const [model, setModel] = useState(null)
  const [face, setFaces] = useState([])
  const [cameraPermission, setCameraPermission] = useState(null);
  const [isPermissionGranted, setIsPermissionGranted] = useState(false);
  const cameraRef = useRef(null);
  const devices = useCameraDevice('front')
  const plugin = useTensorflowModel(require('./assets/mobilefacenet.tflite'))
  const { detectFaces } = useFaceDetector()
  const [resizedImageUri, setResizedImageUri] = useState(null);
  const [rawPhotUri,setRawPhotoUri]=useState("")

  // load model 
  useEffect(() => {
    if (plugin) {
      setModel(plugin)
      console.log("modal load sucessfully")
    } else {
      console.log("model loading failed");
    }
  }, [plugin])


  //camera permission
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


  const takeSnapshot = async (faces) => {

    if (!cameraRef.current || faces.length === 0) {
      console.warn("No camera or no face detected.");
      return;
    }
    try {
      const photo = await cameraRef.current.takePhoto({
        quality: 1, // Adjust quality as needed
      });
      console.log(photo.height)
      const rawPhotoUri = `file://${photo.path}`;
      console.log(rawPhotoUri)

      setRawPhotoUri(`file://${photo.path}`)

      const { x, y, width, height } = faces[0].bounds;

      const frameWidth = 640; // Frame width
      const frameHeight = 480; // Frame height

      const photoWidth = photo.width; // Actual photo width
      const photoHeight = photo.height; // Actual photo height

      const scaleX = photoWidth / frameWidth;
      const scaleY = photoHeight / frameHeight;

      // const aspectRatioFrame = frameWidth / frameHeight;
      // const aspectRatioPhoto = photoWidth / photoHeight;

      // let cropX = x * scaleX;
      // let cropY = y * scaleY;
      // let cropWidth = width * scaleX;
      // let cropHeight = height * scaleY;

      // if (aspectRatioFrame !== aspectRatioPhoto) {
      //   if (aspectRatioPhoto > aspectRatioFrame) {
      //     // Photo is wider than frame, adjust Y
      //     const adjustedFrameHeight = frameWidth / aspectRatioPhoto;
      //     const yOffset = (frameHeight - adjustedFrameHeight) / 2;
      //     cropY = (y - yOffset) * scaleY;
      //   } else {
      //     // Photo is taller than frame, adjust X
      //     const adjustedFrameWidth = frameHeight * aspectRatioPhoto;
      //     const xOffset = (frameWidth - adjustedFrameWidth) / 2;
      //     cropX = (x - xOffset) * scaleX;
      //   }
      // }

      const manualOffsetX = 900; // Adjust horizontal position (positive moves right)
      const manualOffsetY = -5; // Adjust vertical position (positive moves down)
      const manualScaleWidth = 1.1; // Scale width (1.1 increases by 10%)
      const manualScaleHeight = 1.1; // Scale height (1.1 increases by 10%)

      // Apply manual adjustments
      let cropX = x * scaleX + manualOffsetX;
      let cropY = y * scaleY + manualOffsetY;
      let cropWidth = width * scaleX * manualScaleWidth;
      let cropHeight = height * scaleY * manualScaleHeight;

      // Ensure cropping coordinates are within bounds
      cropX = Math.max(0, cropX);
      cropY = Math.max(0, cropY);
      cropWidth = Math.min(photoWidth - cropX, cropWidth);
      cropHeight = Math.min(photoHeight - cropY, cropHeight);



      console.log("Scaled coordinates for cropping:", cropX, cropY, cropWidth, cropHeight);
      const cropData = {
        offset: { x: cropX, y: cropY },
        size: { width: cropWidth, height: cropHeight },
        resizeMode: 'cover',
      };
      const croppedImageUri = await ImageEditor.cropImage(rawPhotoUri, cropData);
      console.log('Cropped Image URI:', croppedImageUri.path);
      resizeImage(croppedImageUri.uri)

    } catch (error) {
      console.error("Error taking snapshot or cropping:", error);
    }
  }

  const imageProessing = async (image) => {
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
    handleModelOutput(floatArray)
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
      console.log('Resized Image URI:', resizedImage.uri);
      setResizedImageUri(resizedImage.uri);

    } catch (error) {
      console.error('Error resizing image:', error);
    }
  };

  const image = useImage(resizedImageUri || null)

  const handleModelOutput = async (inputFloatArray) => {

    try {
      const inferenceResult = await model.model.run([inputFloatArray]);

      if (Array.isArray(inferenceResult)) {
        const output = inferenceResult;

        console.log(output[0]);

        const point1 = output[0]
        const point2 = userData.enbeddings

        const distance = calculateEuclideanDistance(point1, point2)

        console.log('Euclidean Distance:', distance);

        if (distance < 0.4) {
          console.log("rohit")

        } else {
          console.log("unknown")
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



  useEffect(() => {
    if (image) {
      imageProessing(image); // Process the image once it's loaded
    }
  }, [image]);



  const handleDetectFace = Worklets.createRunOnJS(faces => {
    if (faces.length > 0) {
      setFaces(faces)
      takeSnapshot(faces)
    } else {

      console.log('No faces detected');
      setFaces([]); // Clear previous faces if needed
    }

  })

  const frameProcessor = useFrameProcessor((frame) => {
    'worklet';
    try {
      const faces = detectFaces(frame)
      handleDetectFace(faces)

    } catch (error) {
      console.error(error.stack);
    }
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
                  x={face.bounds.x}
                  y={face.bounds.y}
                  width={face.bounds.width}
                  height={face.bounds.height}
                  color="rgba(255, 0, 0, 0.5)" // Semi-transparent red
                  style="stroke"
                  strokeWidth={4}
                />
              </>
            ))}
          </Canvas>
          <Image
            source={{ uri: resizedImageUri }}
            style={styles.image}
          />
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
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
  image: {
    width: 200,
    height: 200,
    top: 20,
    resizeMode: 'contain'
  },
});

export default App