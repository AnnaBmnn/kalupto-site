import * as THREE from 'three'
import Experience from '../Experience.js'

export default class Rocks
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.time = this.experience.time
        this.debug = this.experience.debug

        // Resource
        this.textures = {
            color: this.resources.items.IceColor,
            dis: this.resources.items.IceDisp,
            normal: this.resources.items.IceNorm,
            occ: this.resources.items.IceOcc,
            spec: this.resources.items.IceSpecular,
        }
        // this.textures = {
        //     color: this.resources.items.AgateColor,
        //     dis: this.resources.items.AgateDisp,
        //     normal: this.resources.items.AgateNorm,
        //     occ: this.resources.items.AgateOcc,
        //     rough: this.resources.items.AgateRoughness
        // }
        // this.textures = {
        //     color: this.resources.items.CrystalColor,
        //     dis: this.resources.items.CrystalDisp,
        //     normal: this.resources.items.CrystalNorm,
        //     occ: this.resources.items.CrystalOcc,
        //     rough: this.resources.items.CrystalRoughness
        // }

        console.log(this.resources)

        // Set up
        this.setGeometry()
        this.setMaterial()
        this.setMesh()

        // Debug
        if(this.debug.active)
        {
            this.debugFolder = this.debug.ui.addFolder('Rock')

            // this.debugFolder
            //     .add(this.model.position, 'x')
            //     .name('position x')
            //     .min(-100)
            //     .max(100)
            //     .step(0.01)

        }
    }
    setMaterial()
    {
        this.material = new THREE.MeshStandardMaterial({
            map: this.textures.color,
            normalMap: this.textures.normal,
            displacementMap: this.textures.dis,
            aoMap: this.textures.occ,
            // roughnessMap: this.textures.rough,
            side: THREE.DoubleSide,
            displacementScale: 0.5,
        })
    }
    setGeometry()
    {
        this.geometry = new THREE.SphereGeometry(1, 16, 16)
    }
    setMesh()
    {
        this.mesh = new THREE.Mesh( this.geometry, this.material )
        // this.mesh.scale.set(25, 25, 25)

        this.scene.add( this.mesh )
    }

    update()
    {
        // this.mesh.rotation.y += 0.001
        if(this.experience){
            let _scale = this.experience.world.audio.frequenceAverage * 1.0 + 25

            // this.mesh.scale.set(_scale, _scale, _scale)
        }

    }
}